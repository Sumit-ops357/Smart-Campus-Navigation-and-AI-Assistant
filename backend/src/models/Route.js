const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Route", RouteSchema);
