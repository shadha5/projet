const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const client = new Schema(
  {
    session: {
      type: Schema.Types.ObjectId,
      ref: "sessions",
      required: true,
    },
    person: {
      type: Schema.Types.ObjectId,
      ref: "persons",
      required: true,
    },
    socket: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "Clients" }
);

module.exports = mongoose.model("clients", client);
