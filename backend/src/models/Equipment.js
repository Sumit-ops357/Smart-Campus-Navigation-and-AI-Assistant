const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  totalQuantity: { type: Number, required: true },
  availableQuantity: { type: Number, required: true },
  condition: { 
    type: String, 
    enum: ["Excellent", "Good", "Worn", "Needs Repair"], 
    default: "Good" 
  },
  lastChecked: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Equipment", equipmentSchema);
