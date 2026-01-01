const mongoose = require("mongoose");

const playmateRequestSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  sport: { type: String, required: true },
  facility: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Facility" 
  },
  message: String,
  playersNeeded: { type: Number, default: 1 },
  playDateTime: { type: Date, required: true },
  joinedPlayers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  status: { 
    type: String, 
    enum: ["open", "filled", "cancelled"], 
    default: "open" 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PlaymateRequest", playmateRequestSchema);
