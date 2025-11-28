// backend/src/models/Location.js

const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // "Academic", "Facilities", "Sports"
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    building: String,
    floor: String,
    description: String,
    amenities: [String],
    openingHours: String,
    imageUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", LocationSchema);
