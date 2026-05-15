const express = require("express");

const {
  sendMessage,
  getConversation,
  getChatList
} = require("../controllers/messageController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


// SEND MESSAGE
router.post("/", protect, sendMessage);


// GET CONVERSATION
router.get("/:userId", protect, getConversation);


// CHAT LIST (NEW)
router.get("/chat-list", protect, getChatList);


module.exports = router;