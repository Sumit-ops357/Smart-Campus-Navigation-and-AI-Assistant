// backend/src/controllers/locationController.js

const Location = require("../models/Location");

// GET /api/locations
const getLocations = async (req, res, next) => {
  try {
    const locations = await Location.find({});
    res.json(locations);
  } catch (err) {
    next(err);
  }
};

// GET /api/locations/:id
const getLocationById = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json(location);
  } catch (err) {
    next(err);
  }
};

// POST /api/locations (admin)
const createLocation = async (req, res, next) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (err) {
    next(err);
  }
};

// PUT /api/locations/:id (admin)
const updateLocation = async (req, res, next) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json(location);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/locations/:id (admin)
const deleteLocation = async (req, res, next) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json({ message: "Location deleted" });
  } catch (err) {
    next(err);
  }
};

// GET /api/locations/search?q=
const searchLocations = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const regex = new RegExp(q, "i");
    const locations = await Location.find({
      $or: [
        { name: regex },
        { description: regex },
        { building: regex },
      ],
    });
    res.json(locations);
  } catch (err) {
    next(err);
  }
};

// GET /api/locations/category/:cat
const getByCategory = async (req, res, next) => {
  try {
    const { cat } = req.params;
    const locations = await Location.find({ category: cat });
    res.json(locations);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  searchLocations,
  getByCategory,
};
