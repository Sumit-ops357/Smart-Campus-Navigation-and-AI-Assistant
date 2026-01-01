// backend/src/controllers/authController.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

const generateToken = (user) =>
  jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, {
    expiresIn: "7d",
  });

// ✅ REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check existing email
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Email already registered. Please login instead." });
    }

    // create user (your User schema will hash password if you use pre-save)
    const isAdmin = req.body.role === "admin";
    const user = await User.create({ name, email, password, isAdmin });

    const token = generateToken(user);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Register error:", err);

    // handle duplicate key (just in case)
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res
        .status(400)
        .json({ message: "Email already registered. Please login instead." });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN (same behaviour as you had)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
