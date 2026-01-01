// backend/src/models/User.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Location" }],
    routeHistory: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
        to: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    rsvpEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // [NEW]
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", UserSchema);
