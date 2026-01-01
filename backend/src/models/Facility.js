const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Indoor", "Outdoor", "Gym", "Court", "Pool", "Field"], 
    required: true 
  },
  location: { type: String, required: true },
  description: String,
  imageUrl: String,
  timings: {
    open: String,
    close: String
  },
  isAvailable: { type: Boolean, default: true },
  occupancyLimit: Number,
  currentOccupancy: { type: Number, default: 0 },
  amenities: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Facility", facilitySchema);
