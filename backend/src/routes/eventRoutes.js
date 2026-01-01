// backend/src/routes/eventRoutes.js
const express = require("express");
const router = express.Router();

const {
  getUpcomingEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// later you can add auth:
// const { requireAuth, requireAdmin } = require("../middleware/auth");

// GET /api/events
router.get("/", getUpcomingEvents);

// GET /api/events/:id
router.get("/:id", getEventById);

// POST /api/events
router.post("/", createEvent);

// PUT /api/events/:id
router.put("/:id", updateEvent);

// DELETE /api/events/:id
router.delete("/:id", deleteEvent);

module.exports = router;
