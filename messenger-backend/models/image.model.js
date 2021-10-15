const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const image = new Schema(
  {
    real_name: {
      type: String,
    },
    url: {
      type: String,
    },
    access: {
      type: String,
      enum: {
        values: ["public", "privet"],
        message: "{VALUE} is not supported.",
      },
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "conversation",
    },
  },
  { collection: "Images" }
);

module.exports = mongoose.model("images", image);
