// backend/src/routes/locationRoutes.js

const express = require("express");
const {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  searchLocations,
  getByCategory,
} = require("../controllers/locationController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", getLocations);
router.get("/search", searchLocations);
router.get("/category/:cat", getByCategory);
router.get("/:id", getLocationById);

router.post("/", requireAuth, requireAdmin, createLocation);
router.put("/:id", requireAuth, requireAdmin, updateLocation);
router.delete("/:id", requireAuth, requireAdmin, deleteLocation);

module.exports = router;
