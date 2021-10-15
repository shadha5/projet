const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require("bcrypt");

//  VALIDATIONS
const {
  validateSignupRequest,
  validateSigninRequest,
} = require("../validation/sys.validations");

//  TOKENS
const { getPersonToken } = require("../utils/tokens");

/****************/
/**** SIGNUP ****/
/****************/

// @desc    Sign up person
// @route   POST /api/v1/sign-up
// @access  PUBLIC
exports.signUp = asyncHandler(async (req, res, next) => {
  //  VALIDATION
  const errors = await validateSignupRequest({ ...req.body });

  //  RETURN ERROR IN CASE
  if (errors.length > 0) {
    return next(new ErrorResponse(errors, 400));
  }

  //  ASSIGN DATA
  const { username, first_name, last_name, password } = req.body;

  //  CREATE USER
  const person = await global
    .Person({
      username: username.toLowerCase(),
      first_name,
      last_name,
      password: await bcrypt.hash(password, 10),
    })
    .save();

  //  CREATE NEW SESSION
  const session = await global
    .Session({
      person_id: person._id,
      created: Math.floor(Date.now() / 1000),
    })
    .save();

  //  HTTP RESPONSE
  res
    .status(200)
    .cookie("token", await getPersonToken(session._id), {
      path: "/",
      domain: process.env.DOMAIN,
      secure: true,
      httpOnly: true,
      sameSite: "strict",
    })
    .json({
      success: true,
      message: "Person has been successfully signed up.",
    });
});

/****************/
/**** SIGNIN ****/
/****************/

// @desc    Sign in person
// @route   POST /api/v1/sign-in
// @access  PUBLIC
exports.signIn = asyncHandler(async (req, res, next) => {
  //  VALIDATION
  const errors = await validateSigninRequest({ ...req.body });

  //  RETURN ERROR IN CASE
  if (errors.length > 0) {
    return next(new ErrorResponse(errors, 400));
  }

  //  ASSIGN DATA
  const { username, password } = req.body;

  //  FIND PERSON
  const person = await global.Person.findOne({ username }).select("+password");

  //  CHECK IF PERSON EXISTS
  if (!person) {
    return next(
      new ErrorResponse(
        [
          {
            errorName: "authentication_error",
            errorMessage: "Invalid credentials.",
          },
        ],
        401
      )
    );
  }

  //  CHECK IF PASSWORD MATCHES
  const result = await bcrypt.compare(password, person.password);
  if (!result) {
    return next(
      new ErrorResponse(
        [
          {
            errorName: "authentication_error",
            errorMessage: "Invalid credentials.",
          },
        ],
        401
      )
    );
  }

  //  CREATE NEW SESSION
  const session = await global
    .Session({
      person_id: person._id,
      created: Math.floor(Date.now() / 1000),
    })
    .save();

  //  HTTP RESPONSE
  res
    .status(200)
    .cookie("token", await getPersonToken(session._id), {
      path: "/",
      domain: process.env.DOMAIN,
      secure: true,
      httpOnly: true,
      sameSite: "strict",
    })
    .json({
      success: true,
      message: "Person has been successfully signed in.",
    });
});

/*****************/
/**** SIGNOUT ****/
/*****************/

// @desc    Sign out person
// @route   POST /api/v1/sign-out
// @access  PRIVET
exports.signOut = asyncHandler(async (req, res, next) => {
  //  END SESSION
  await global.Session.findOneAndUpdate(
    { _id: req.session._id },
    {
      $set: {
        active: false,
      },
    }
  );

  await global.Client.updateMany(
    { session: req.session._id },
    { $set: { active: false } }
  );

  //  SET USER AS ACTIVE
  //  AT LEAST ONE CLIENT IS ACTIVE
  const activeClients = await global.Client.find({
    session: req.session._id,
    active: true,
  });

  //  SET STATUS
  await global.Person.findOneAndUpdate(
    {
      _id: req.session.person_id._id,
    },
    {
      $set: {
        status: activeClients.length > 0 ? "active" : "inactive",
      },
    }
  );

  //  HTTP RESPONSE
  res.status(200).json({
    success: true,
    message: "Person has been successfully signed out.",
  });
});

/************************/
/**** VERIFY SESSION ****/
/************************/

// @desc    Verify Session
// @route   POST /api/v1/session
// @access  PRIVET
exports.verifySession = asyncHandler(async (req, res, next) => {
  //  HTTP RESPONSE
  res.status(200).json({
    success: true,
    message: "Session has been successfully verfied.",
    data: req.session.person_id,
  });
});

/****************/
/**** SIGNUP ****/
/****************/

// @desc    UPDATE PERSON ACCOUNT
// @route   PUT /api/v1/account
// @access  PUBLIC
exports.updateAccount = asyncHandler(async (req, res, next) => {
  //  ASSIGN DATA
  const { image, first_name, last_name, password, old_password } = req.body;

  //  DATA TO UPDATE
  const toUpdate = { image, first_name, last_name, password };

  //  DELETE FIRSTNAME KEY IF EMPTY OR UNDEFINED
  if (
    !toUpdate.first_name ||
    (toUpdate.first_name && toUpdate.first_name.trim() === "")
  ) {
    delete toUpdate.first_name;
  }

  //  DELETE LASTNAME KEY IF EMPTY OR UNDEFINED
  if (
    !toUpdate.last_name ||
    (toUpdate.last_name && toUpdate.last_name.trim() === "")
  ) {
    delete toUpdate.last_name;
  }

  //  DELETE PASSWORD KEY IF EMPTY OR UNDEFINED
  if (
    !toUpdate.password ||
    (toUpdate.password && toUpdate.password.trim() === "")
  ) {
    delete toUpdate.password;
  } else {
    //  FIND PERSON
    const person = await global.Person.findOne({
      _id: req.session.person_id._id,
    }).select("+password");

    //  CHECK IF PASSWORD MATCHES
    const result = await bcrypt.compare(old_password, person.password);

    //  CHECK IF PASSWORD MATCHES
    if (!result) {
      return next(
        new ErrorResponse(
          [
            {
              errorName: "invalid_request_error",
              errorMessage: "Old password is not valid.",
            },
          ],
          400
        )
      );
    }
    //  HASH NEW PASSWORD
    toUpdate.password = await bcrypt.hash(toUpdate.password, 10);
  }

  //  SET IMAGE TO NULL IF EMTY OR UNDEFINED
  if (!toUpdate.image || (toUpdate.image && toUpdate.image.trim() === "")) {
    toUpdate.image = null;
  }

  //  CREATE USER
  await global.Person.findOneAndUpdate(
    { _id: req.session.person_id._id },
    {
      $set: toUpdate,
    }
  );

  //  FETCH NEW DATA
  const data = await global.Person.findOne({ _id: req.session.person_id._id });

  //  HTTP RESPONSE
  res.status(200).json({
    success: true,
    message: "Person has been successfully updated.",
    data,
  });
});
