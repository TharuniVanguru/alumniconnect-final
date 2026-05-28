const express =
  require("express");

const {

  sendMessage,

  getConversation,

  getChatList,

  markMessagesAsRead,

} = require(
  "../controllers/messageController"
);

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// ==========================================
// SEND MESSAGE
// ==========================================
router.post(

  "/",

  protect,

  sendMessage

);


// ==========================================
// CHAT LIST
// IMPORTANT:
// MUST COME BEFORE :userId
// ==========================================
router.get(

  "/chat-list",

  protect,

  getChatList

);


// ==========================================
// MARK MESSAGES AS READ
// ==========================================
router.put(

  "/read/:userId",

  protect,

  markMessagesAsRead

);


// ==========================================
// GET CONVERSATION
// ==========================================
router.get(

  "/:userId",

  protect,

  getConversation

);


// ==========================================
// EXPORT
// ==========================================
module.exports =
  router;