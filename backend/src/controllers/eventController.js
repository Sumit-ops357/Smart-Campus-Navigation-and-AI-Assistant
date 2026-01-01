const Event = require("../models/Event");

// GET /api/events  -> upcoming (non‑expired) events
const getUpcomingEvents = async (req, res, next) => {
  try {
    const now = new Date();

    const events = await Event.find({
      endTime: { $gte: now },
    })
      .sort({ startTime: 1 })
      .limit(50);

    res.json(events);
  } catch (err) {
    next(err);
  }
};

// GET /api/events/:id
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    next(err);
  }
};

// POST /api/events  -> create new event (with imageUrl)
const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

// PUT /api/events/:id  -> update event
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/events/:id  -> delete manually
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUpcomingEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
