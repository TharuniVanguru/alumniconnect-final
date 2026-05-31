const express =
  require("express");

const {

  sendMessage,

  getConversation,

  getChatList,

  markMessagesAsRead,

  deleteMessage,

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
// ALL ROUTES PROTECTED
// ==========================================
router.use(
  protect
);


// ==========================================
// SEND MESSAGE
// POST /api/messages
// ==========================================
router.post(

  "/",

  sendMessage

);


// ==========================================
// GET CHAT LIST
// GET /api/messages/chat-list
// ==========================================
router.get(

  "/chat-list",

  getChatList

);


// ==========================================
// MARK MESSAGES AS READ
// PUT /api/messages/read/:userId
// ==========================================
router.put(

  "/read/:userId",

  markMessagesAsRead

);


// ==========================================
// GET CONVERSATION
// GET /api/messages/:userId
// ==========================================
router.get(

  "/:userId",

  getConversation

);


// ==========================================
// DELETE MESSAGE
// DELETE /api/messages/:messageId
// ==========================================
router.delete(

  "/delete/:messageId",

  deleteMessage

);


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports =
  router;