const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const session = new Schema(
  {
    person_id: {
      type: Schema.Types.ObjectId,
      ref: "persons",
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    created: {
      type: Number,
    },
  },
  { collection: "Sessions" }
);

module.exports = mongoose.model("sessions", session);
