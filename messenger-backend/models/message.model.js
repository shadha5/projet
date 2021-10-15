const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const message = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "conversations",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "persons",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "persons",
    },
    message: {
      type: String,
    },
    images: {
      type: Array,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
    read: {
      type: Boolean,
      default: false,
    },
    created: {
      type: Number,
    },
    seen: {
      type: Number,
    },
  },
  { collection: "Messages" }
);

message.post("save", async (doc, next) => {
  //    LODASH
  const _ = require("lodash");

  //  GET ONLINE CLIENTS
  const clients = await global.Client.find({
    person: doc.receiver || doc.sender,
    active: true,
  });

  //  EMIT DATA
  clients.forEach((client) => {
    emitterClient = global.io[client.socket];
    if (emitterClient) {
      emitterClient.emit("messageCreated", doc);
    }
  });
  next();
});

module.exports = mongoose.model("messages", message);
