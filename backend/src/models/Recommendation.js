const mongoose = require("mongoose");

const RecommendationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "Highlight" },
    locationName: { type: String, required: true },
    building: { type: String, default: "" },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    imageUrl: { type: String, default: "" },

    // NEW: where to show this item: "smart", "popular", or "both"
    type: {
      type: String,
      enum: ["smart", "popular", "both"],
      default: "smart",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recommendation", RecommendationSchema);
