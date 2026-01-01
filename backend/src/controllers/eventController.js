const Event = require("../models/Event");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// MULTER SETUP
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// GET /api/events  -> upcoming (non‑approved) events
const getUpcomingEvents = async (req, res, next) => {
  try {
    const now = new Date();

    const events = await Event.find({
      endTime: { $gte: now },
      isApproved: true,
    })
      .sort({ startTime: 1 })
      .limit(50);

    res.json(events);
  } catch (err) {
    next(err);
  }
};

// GET /api/events/pending -> admin only
const getPendingEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ isApproved: false }).sort({ createdAt: -1 });
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

// POST /api/events  -> create new event (with multer file or url)
const createEvent = async (req, res, next) => {
  try {
    const eventData = { ...req.body };
    
    // Handle local file upload via multer
    if (req.file) {
      eventData.imageUrl = `/uploads/${req.file.filename}`;
    }

    // If not admin, require approval
    if (!req.user || !req.user.isAdmin) {
      eventData.isApproved = false;
    } else {
      // Admins can auto-approve their own events if they want (default to true)
      eventData.isApproved = true;
    }
    
    const event = await Event.create(eventData);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/events/:id/approve -> admin only
const approveEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id, 
      { isApproved: true }, 
      { new: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
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

const rsvpEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    const index = user.rsvpEvents.indexOf(event._id);
    if (index > -1) {
      // Remove RSVP
      user.rsvpEvents.splice(index, 1);
      event.rsvpCount = Math.max(0, event.rsvpCount - 1);
    } else {
      // Add RSVP
      user.rsvpEvents.push(event._id);
      event.rsvpCount += 1;
    }

    await user.save();
    await event.save();

    res.json({ 
      rsvpCount: event.rsvpCount, 
      isRSVPed: user.rsvpEvents.includes(event._id) 
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/events/admin/all -> admin only
const getAdminEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ startTime: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUpcomingEvents,
  getPendingEvents,
  getAdminEvents,
  getEventById,
  createEvent,
  approveEvent,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  upload,
};
