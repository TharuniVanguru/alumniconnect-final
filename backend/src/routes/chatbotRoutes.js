const express = require("express");

const router = express.Router();

const chatbotController =
  require("../controllers/chatbotController");

const authMiddleware =
  require("../middleware/authMiddleware");


// =========================
// AI CHATBOT ROUTE
// =========================
router.post(

  "/ask",

  authMiddleware.protect,

  chatbotController.chatbot

);


module.exports = router;