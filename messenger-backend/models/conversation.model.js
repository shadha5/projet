const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversation = new Schema(
  {
    persons: [
      {
        type: Schema.Types.ObjectId,
        ref: "persons",
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "messages",
      },
    ],
    created: {
      type: Number,
    },
    updated: {
      type: Number,
    },
  },
  { collection: "Conversations" }
);

conversation.post("save", async (doc, next) => {
  //    LODASH
  const _ = require("lodash");

  //  GET ONLINE CLIENTS
  const clients = await global.Client.find({
    person: { $in: doc.persons },
    active: true,
  });

  //  POPULATE FIELDS
  const conversation = await global.Conversation.findOne({ _id: doc._id })
    .populate("persons")
    .populate("messages");

  //  EMIT DATA
  clients.forEach((client) => {
    emitterClient = global.io[client.socket];
    if (emitterClient) {
      emitterClient.emit("conversationCreated", conversation);
    }
  });
  next();
});

conversation.post("findOneAndUpdate", async (doc, next) => {
  //    LODASH
  const _ = require("lodash");

  //  GET ONLINE CLIENTS
  const clients = await global.Client.find({
    person: { $in: doc.persons },
    active: true,
  });

  //  POPULATE FIELDS
  const conversation = await global.Conversation.findOne({ _id: doc._id })
    .populate("persons")
    .populate("messages");

  //  EMIT DATA
  clients.forEach((client) => {
    emitterClient = global.io[client.socket];
    if (emitterClient) {
      emitterClient.emit("conversationUpdated", conversation);
    }
  });
  next();
});

module.exports = mongoose.model("conversations", conversation);
