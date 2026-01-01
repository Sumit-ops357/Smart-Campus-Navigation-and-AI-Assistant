const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middleware/auth");
const {
  getFacilities,
  createFacility,
  getMyBookings,
  createBooking,
  cancelBooking,
  getPlaymateRequests,
  createPlaymateRequest,
  joinPlaymateRequest,
  getEquipment,
  updateOccupancy
} = require("../controllers/sportsController");

// Facilities
router.get("/facilities", getFacilities);
router.post("/facilities", requireAuth, requireAdmin, createFacility);

// Bookings
router.get("/bookings", requireAuth, getMyBookings);
router.post("/bookings", requireAuth, createBooking);
router.patch("/bookings/:id/cancel", requireAuth, cancelBooking);

// Playmates
router.get("/playmates", getPlaymateRequests);
router.post("/playmates", requireAuth, createPlaymateRequest);
router.post("/playmates/:id/join", requireAuth, joinPlaymateRequest);

// Equipment & Gym
router.get("/equipment", getEquipment);
router.patch("/facilities/occupancy", requireAuth, requireAdmin, updateOccupancy);

module.exports = router;
