const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  facility: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Facility", 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["confirmed", "cancelled", "completed"], 
    default: "confirmed" 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
