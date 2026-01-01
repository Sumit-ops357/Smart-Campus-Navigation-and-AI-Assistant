const Facility = require("../models/Facility");
const Booking = require("../models/Booking");
const PlaymateRequest = require("../models/PlaymateRequest");
const Equipment = require("../models/Equipment");

// --- FACILITIES ---
const getFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.find();
    res.json(facilities);
  } catch (err) {
    next(err);
  }
};

const createFacility = async (req, res, next) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json(facility);
  } catch (err) {
    next(err);
  }
};

// --- BOOKINGS ---
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("facility");
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { facilityId, date, startTime, endTime } = req.body;
    
    // Check for existing booking conflicts
    const conflict = await Booking.findOne({
      facility: facilityId,
      date: new Date(date),
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } }
      ],
      status: "confirmed"
    });

    if (conflict) {
      return res.status(400).json({ message: "This slot is already booked." });
    }

    const booking = await Booking.create({
      facility: facilityId,
      user: req.user.id,
      date,
      startTime,
      endTime
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: "cancelled" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

// --- PLAYMATE REQUESTS ---
const getPlaymateRequests = async (req, res, next) => {
  try {
    const requests = await PlaymateRequest.find({ status: "open" })
      .populate("user", "name")
      .populate("facility", "name");
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

const createPlaymateRequest = async (req, res, next) => {
  try {
    const request = await PlaymateRequest.create({
      ...req.body,
      user: req.user.id
    });
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

const joinPlaymateRequest = async (req, res, next) => {
  try {
    const request = await PlaymateRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    
    if (request.joinedPlayers.includes(req.user.id)) {
      return res.status(400).json({ message: "Already joined" });
    }

    request.joinedPlayers.push(req.user.id);
    if (request.joinedPlayers.length >= request.playersNeeded) {
      request.status = "filled";
    }
    await request.save();
    res.json(request);
  } catch (err) {
    next(err);
  }
};

// --- EQUIPMENT & OCCUPANCY ---
const getEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.find();
    res.json(equipment);
  } catch (err) {
    next(err);
  }
};

const updateOccupancy = async (req, res, next) => {
  try {
    const { facilityId, occupancy } = req.body;
    const facility = await Facility.findByIdAndUpdate(
      facilityId,
      { currentOccupancy: occupancy },
      { new: true }
    );
    res.json(facility);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFacilities,
  createFacility,
  getMyBookings,
  createBooking,
  cancelBooking,
  getPlaymateRequests,
  createPlaymateRequest,
  joinPlaymateRequest,
  getEquipment,
  updateOccupancy
};
