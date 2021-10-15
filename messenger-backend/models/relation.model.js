const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const relation = new Schema(
  {
    persons: [
      {
        type: Schema.Types.ObjectId,
        ref: "persons",
      },
    ],
    source: {
      type: Schema.Types.ObjectId,
      ref: "persons",
    },
    type: {
      type: String,
      enum: ["friends", "message-request"],
      default: "message-request",
    },
    created: {
      type: Number,
    },
  },
  { collection: "Relations" }
);

relation.post("save", async (doc, next) => {
  //    LODASH
  const _ = require("lodash");

  //  GET ONLINE CLIENTS
  const clients = await global.Client.find({
    person: { $in: doc.persons },
    active: true,
  });

  //  POPULATE FIELDS
  const contact = await global.Relation.findOne({ _id: doc._id }).populate(
    "persons"
  );

  //  EMIT DATA
  clients.forEach((client) => {
    emitterClient = global.io[client.socket];
    if (emitterClient) {
      emitterClient.emit("contactCreated", contact);
    }
  });
  next();
});

relation.post("findOneAndUpdate", async (doc, next) => {
  //    LODASH
  const _ = require("lodash");

  //  GET ONLINE CLIENTS
  const clients = await global.Client.find({
    person: { $in: doc.persons },
    active: true,
  });

  //  POPULATE FIELDS
  const contact = await global.Relation.findOne({ _id: doc._id }).populate(
    "persons"
  );

  //  EMIT DATA
  clients.forEach((client) => {
    emitterClient = global.io[client.socket];
    if (emitterClient) {
      emitterClient.emit("contactUpdated", contact);
    }
  });
  next();
});

module.exports = mongoose.model("relations", relation);
