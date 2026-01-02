// backend/src/server.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const eventRoutes = require("./routes/eventRoutes");
const locationRoutes = require("./routes/locationRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const sportsRoutes = require("./routes/sportsRoutes");

const { register, login } = require("./controllers/authController");
const { askGemini } = require("./services/aiService");
const chatRoutes = require("./routes/chatRoutes");



dotenv.config();

const app = express();

app.get("/favicon.ico", (req, res) => res.status(204).end());

const path = require("path");

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smart-campus-navigation-and-ai-assi.vercel.app",
      process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true,
  })
);

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME || "smart-campus",
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Location routes
app.use("/api/locations", locationRoutes);
app.use("/api/chat", chatRoutes);

// Auth routes
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);

// AI chat route
app.post("/api/ai/chat", async (req, res, next) => {
  try {
    const { message, history } = req.body;
    const reply = await askGemini(message, history || []);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

// Recommendation + Events routes
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/sports", sportsRoutes);

// Health
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Backend running" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
