global.io = {};
global.Session = require("./models/session.model");
global.Person = require("./models/person.model");
global.Conversation = require("./models/conversation.model");
global.Message = require("./models/message.model");
global.Relation = require("./models/relation.model");
global.Image = require("./models/image.model");
global.Client = require("./models/client.model");

//  IMPORT MODULES
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
var cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDb = require("./config/db");
const express = require("express");
const dotenv = require("dotenv");
const _ = require("colors");
const { decodePersonJwt } = require("./utils/tokens");
const ErrorResponse = require("./utils/errorResponse");
const path = require("path");

// LOAD ENV VARS
dotenv.config({ path: "./env/config.env" });

// CONNECT TO DATA BASE
connectDb();

//  EXPRESS SERVER
const app = express();

//  STATIC FOLDER
app.use(express.static("public"));

//  DEV LOGGING MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//  COOKIES PARSER
app.use(cookieParser());

//  ACCOUNT ROUTES
const conversation = require("./routes/conversation.route");
const account = require("./routes/account.route");
const message = require("./routes/message.route");
const contact = require("./routes/contact.route");
const search = require("./routes/search.route");
const person = require("./routes/person.route");

//  CORS
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

//  PARSE APPLICATION/X-WWW-FORM-URLENCODED
app.use(bodyParser.urlencoded({ extended: false }));

//  PARSE APPLICATION/JSON
app.use(bodyParser.json());

//  FILE UPLOAD
app.use(
  fileUpload({
    limits: { fileSize: 4 * 1024 * 1024 * 1024 },
    createParentPath: true,
  })
);

//  XSS PROTECTION
app.use(helmet());
app.use(xss());

//  RATE LIMIT
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 300,
  })
);

//  PREVENT HTTP PARAM POLUTION
app.use(hpp());

//  MOUNT STRIPE CORE ROUTES
app.use("/api/v1", account);
app.use("/api/v1/messages", message);
app.use("/api/v1/contacts", contact);
app.use("/api/v1/conversations", conversation);
app.use("/api/v1/persons", person);
app.use("/api/v1/search", search);

//  REACT BUILD
app.get("*", (req, res) => {
  res
    .set(
      "Content-Security-Policy",
      "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
    )
    .sendFile(path.join(__dirname, "public", "index.html"));
});

//  ERROR HANDLER
app.use(errorHandler);

//  SERVER CONFIGS
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Connected On Port ${PORT} In ${process.env.NODE_ENV} Mode.`.blue.bold
  );
});

//  Socket configuration
const io = require("socket.io")(server, {
  cors: {
    origin: true,
    methods: ["GET"],
    credentials: true,
  },
});

//  Socket auth
io.use(async (socket, next) => {
  const token = await decodePersonJwt(
    socket.request.headers.cookie
      ? socket.request.headers.cookie.split("=")[1]
      : undefined
  );
  if (!token) {
    return next(
      new ErrorResponse(
        {
          errorName: "authentication_error",
          errorMessage: "Socket session expired please login.",
        },
        401
      )
    );
  }
  const session = await global.Session.findOne({ _id: token.session_id });
  if (!session) {
    return next(
      new ErrorResponse(
        {
          errorName: "authentication_error",
          errorMessage: "Socket session expired please login.",
        },
        401
      )
    );
  } else if (!session.active) {
    return next(
      new ErrorResponse(
        {
          errorName: "authentication_error",
          errorMessage: "Socket session expired please login.",
        },
        401
      )
    );
  }

  socket.session = session;
  next();
});

io.on("connection", async (socket) => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      `| Person: `.blue +
        `${socket.session.person_id._id}`.white.underline +
        ` is connected.`.blue
    );
    console.log(`|->   Socket id `.blue + `${socket.id}`.white.underline);
  }

  //  Register new client connection
  await global
    .Client({
      session: socket.session.id,
      person: socket.session.person_id._id,
      socket: socket.id,
    })
    .save();

  //  SET USER AS ACTIVE
  //  AT LEAST ONE CLIENT IS ACTIVE
  const activeClients = await global.Client.find({
    session: socket.session.id,
    person: socket.session.person_id._id,
    active: true,
  });
  //  SET STATUS
  const result = await global.Person.findOneAndUpdate(
    {
      _id: socket.session.person_id._id,
    },
    {
      $set: {
        status: activeClients.length > 0 ? "active" : "inactive",
      },
    }
  );

  //  Register socket objects locally
  global.io = { ...global.io, [socket.id]: socket };

  //  Client disconnected
  socket.on("disconnect", async () => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `| Person: `.red +
          `${socket.session.person_id._id}`.white.underline +
          ` has disconnected.`.red
      );
      console.log(`|->   Socket id `.red + `${socket.id}`.white.underline);
    }

    //  Update connection end time
    await global.Client.findOneAndUpdate(
      {
        session: socket.session.id,
        person: socket.session.person_id._id,
        socket: socket.id,
      },
      {
        $set: {
          active: false,
        },
      }
    );

    //  SET USER AS ACTIVE
    //  AT LEAST ONE CLIENT IS ACTIVE
    const activeClients = await global.Client.find({
      session: socket.session.id,
      person: socket.session.person_id._id,
      active: true,
    });

    //  SET STATUS
    await global.Person.findOneAndUpdate(
      {
        _id: socket.session.person_id._id,
      },
      {
        $set: {
          status: activeClients.length > 0 ? "active" : "inactive",
        },
      }
    );

    //  Delete socket object
    delete global.io[socket.id];
  });
});

//  UNHANDLED PROMISE REJECTIONS
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //  CLOSE SERVER & EXIT PROCESS :)
  server.close(() => process.exit(1));
});
