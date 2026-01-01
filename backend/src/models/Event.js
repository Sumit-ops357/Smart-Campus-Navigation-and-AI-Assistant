const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    // e.g. "Workshop", "Sports", "Cultural", "Tech Talk"
    category: { type: String, default: "General" },

    // When & where
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }, // required so TTL works well
    locationName: { type: String, required: true }, // e.g. "BT Auditorium"
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },

    // Extra info
    organizer: String,

    // Just a URL string or relative path like "/uploads/events/x.jpg"
    imageUrl: String,

    tags: [String],
    rsvpCount: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true }, // [NEW] Default for seed data, users set to false
  },
  { timestamps: true }
);

// TTL index: document expires when endTime is reached
EventSchema.index({ endTime: 1 }, { expireAfterSeconds: 0 }); // [web:41][web:56]

module.exports = mongoose.model("Event", EventSchema);
