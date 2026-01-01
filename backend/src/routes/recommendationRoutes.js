// backend/src/routes/recommendationRoutes.js

const express = require("express");
const router = express.Router();
const {
  smartSuggestions,
  popularSpots,
  createRecommendation,
} = require("../controllers/recommendationController");

// GET /api/recommendations/smart
router.get("/smart", smartSuggestions);

// GET /api/recommendations/popular
router.get("/popular", popularSpots);

// POST /api/recommendations  (create via Postman, not frontend)
router.post("/", createRecommendation);

module.exports = router;
