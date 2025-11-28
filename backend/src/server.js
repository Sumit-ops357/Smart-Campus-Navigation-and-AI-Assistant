// backend/src/server.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const locationRoutes = require("./routes/locationRoutes");
const { register, login } = require("./controllers/authController");
const { askGemini } = require("./services/aiService");
const {
  getSmartSuggestions,
  getPopularSpots,
} = require("./services/recommendationService");

const app = express();

app.get("/favicon.ico", (req, res) => res.status(204).end());


// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
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

// Routes
app.use("/api/locations", locationRoutes);

// Auth routes (no extra file, using key controller)
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);

// AI chat route (uses backend/src/services/aiService.js)
app.post("/api/ai/chat", async (req, res, next) => {
  try {
    const { message, history } = req.body;
    const reply = await askGemini(message, history || []);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

// Recommendation routes (using backend/src/services/recommendationService.js)
app.get("/api/recommendations/smart", async (req, res, next) => {
  try {
    const data = await getSmartSuggestions();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.get("/api/recommendations/popular", async (req, res, next) => {
  try {
    const data = await getPopularSpots();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

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
