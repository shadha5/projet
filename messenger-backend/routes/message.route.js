const express = require("express");
const { isActive } = require("../middleware/auth");

const {
  sendMessage,
  deleteMessage,
} = require("../controllers/message.controller");

const router = express.Router();

router.route("/").post(isActive, sendMessage);

router.route("/:messageId").post(isActive, deleteMessage);

module.exports = router;
