const express = require("express");
const { isActive } = require("../middleware/auth");

const {
  getAllConversations,
  getConversationById,
  deleteConversationById,
} = require("../controllers/conversation.controller");

const router = express.Router();

router.route("/").get(isActive, getAllConversations);

router
  .route("/:conversationId")
  .get(isActive, getConversationById)
  .delete(isActive, deleteConversationById);

module.exports = router;
