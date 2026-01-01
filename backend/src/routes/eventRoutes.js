// backend/src/routes/eventRoutes.js
const express = require("express");
const router = express.Router();

const {
  getUpcomingEvents,
  getPendingEvents,
  getAdminEvents,
  getEventById,
  createEvent,
  approveEvent,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  upload,
} = require("../controllers/eventController");

const { requireAuth, requireAdmin } = require("../middleware/auth");

// GET /api/events
router.get("/", getUpcomingEvents);

// GET /api/events/pending (Admin only)
router.get("/pending", requireAuth, requireAdmin, getPendingEvents);

// GET /api/events/admin/all (Admin only)
router.get("/admin/all", requireAuth, requireAdmin, getAdminEvents);

// GET /api/events/:id
router.get("/:id", getEventById);

// POST /api/events
router.post("/", requireAuth, upload.single("image"), createEvent);

// PATCH /api/events/:id/approve (Admin only)
router.patch("/:id/approve", requireAuth, requireAdmin, approveEvent);

// POST /api/events/:id/rsvp
router.post("/:id/rsvp", requireAuth, rsvpEvent);

// PUT /api/events/:id
router.put("/:id", requireAuth, updateEvent);

// DELETE /api/events/:id
router.delete("/:id", requireAuth, deleteEvent);

module.exports = router;
