const express =
  require("express");

const router =
  express.Router();

const {
  chatbot,
} = require(
  "../controllers/chatbotController"
);

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);


// ==========================================
// AI CHATBOT ROUTE
// ==========================================
router.post(

  "/ask",

  protect,

  chatbot

);


// ==========================================
// AI HEALTH CHECK
// ==========================================
router.get(

  "/",

  protect,

  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "AI Chatbot Routes Working",

    });

  }

);


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports =
  router;