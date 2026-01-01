// backend/src/routes/chatRoutes.js
// Routes for AI chat (Gemini)

const express = require("express");
const router = express.Router();
const { chatWithAi } = require("../controllers/chatController");

// POST /api/chat/message
router.post("/message", chatWithAi);

module.exports = router;
