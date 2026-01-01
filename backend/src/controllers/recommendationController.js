const Recommendation = require("../models/Recommendation");

const smartSuggestions = async (req, res, next) => {
  try {
    const now = new Date();
    const data = await Recommendation.find({
      validFrom: { $lte: now },
      validUntil: { $gt: now },
      type: { $in: ["smart", "both"] },   // ⬅ only smart/both
    }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const popularSpots = async (req, res, next) => {
  try {
    const now = new Date();
    const data = await Recommendation.find({
      validFrom: { $lte: now },
      validUntil: { $gt: now },
      type: { $in: ["popular", "both"] }, // ⬅ only popular/both
    })
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createRecommendation = async (req, res, next) => {
  try {
    const rec = await Recommendation.create(req.body);
    res.status(201).json(rec);
  } catch (err) {
    next(err);
  }
};

module.exports = { smartSuggestions, popularSpots, createRecommendation };
