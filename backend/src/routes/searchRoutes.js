const express =
  require("express");

const {
  searchUsers,
} = require(
  "../controllers/searchController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// ==========================================
// SEARCH USERS
// GET /search
// ==========================================
router.get(

  "/",

  protect,

  searchUsers

);


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports =
  router;