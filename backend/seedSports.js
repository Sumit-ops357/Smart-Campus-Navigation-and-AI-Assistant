const mongoose = require("mongoose");
const Facility = require("./src/models/Facility");
const Equipment = require("./src/models/Equipment");
require("dotenv").config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smart-campus";
const DB_NAME = process.env.DB_NAME || "smart-campus";

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
    console.log(`Connected to MongoDB [${DB_NAME}] for seeding...`);

    // Clear existing
    await Facility.deleteMany({});
    await Equipment.deleteMany({});

    // Add Facilities as requested
    await Facility.create([
      {
        name: "Main Cricket Stadium",
        category: "Field",
        location: "Main Sports Grounds",
        description: "Full-size floodlit cricket stadium with professional turf pitch.",
        imageUrl: "https://media.istockphoto.com/id/655404710/photo/cricket-match-between-local-mumbai-teams.jpg?s=612x612&w=0&k=20&c=i1aFAdP36VoXM0EXdMS2w5MXaU3LzYYqUghn5mh4ORY=",
        timings: { open: "06:00", close: "18:00" },
        amenities: ["Pavilion", "Practice Nets"]
      },
      {
        name: "Elite Fitness Gym",
        category: "Gym",
        location: "Student Wellness Center",
        description: "Advanced gym with cardio zones and free weights.",
        imageUrl: "https://content.jdmagicbox.com/comp/hubli/e2/0836px836.x836.200909115252.t8e2/catalogue/the-empire-fitness-vidyanagar-hubli-hubli-gyms-giknp98z67.jpg",
        timings: { open: "05:00", close: "22:00" },
        amenities: ["AC", "Sauna"]
      },
      {
        name: "Volleyball Court",
        category: "Court",
        location: "Outdoor Sports Zone",
        description: "Standard volleyball courts with night lighting.",
        imageUrl: "https://i.ytimg.com/vi/izTGAE2Wois/maxresdefault.jpg",
        timings: { open: "16:00", close: "21:00" },
        amenities: ["Floodlights"]
      },
      {
        name: "Basketball Arena",
        category: "Court",
        location: "Indoor Arena B",
        description: "Synthetic floor basketball court for casual play.",
        imageUrl: "https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=1200&q=80",
        timings: { open: "06:00", close: "22:00" },
        amenities: ["Scoreboard"]
      },
      {
        name: "Kabaddi Training Center",
        category: "Field",
        location: "Arena Grounds",
        description: "Professional Kabaddi training grounds.",
        imageUrl: "https://www.economist.com/cdn-cgi/image/width=1424,quality=80,format=auto/media-assets/image/20221008_BLP507.jpg",
        timings: { open: "05:30", close: "10:00" },
        amenities: ["Medical Room", "Mats"]
      },
      {
        name: "Indoor Games Hub",
        category: "Indoor",
        location: "Student Union Building",
        description: "Chess, Carom, and Table Tennis equipment provided.",
        imageUrl: "https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1200&q=80",
        timings: { open: "09:00", close: "21:00" },
        amenities: ["Lounge"]
      },
      {
        name: "Badminton Hall",
        category: "Court",
        location: "Indoor Arena Stage 1",
        description: "Multiple synthetic courts for casual matches.",
        imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
        timings: { open: "06:00", close: "22:00" },
        amenities: ["Locker Rooms"]
      }
    ]);

    // Add Equipment
    await Equipment.create([
      { name: "Cricket Kit", category: "Gear", totalQuantity: 10, availableQuantity: 6 },
      { name: "Basketball", category: "Balls", totalQuantity: 15, availableQuantity: 12 },
      { name: "Volleyball", category: "Balls", totalQuantity: 12, availableQuantity: 8 },
      { name: "TT Rackets", category: "Indoor", totalQuantity: 20, availableQuantity: 15 },
      { name: "Chess Set", category: "Indoor", totalQuantity: 10, availableQuantity: 10 },
      { name: "Carom Board", category: "Indoor", totalQuantity: 5, availableQuantity: 4 }
    ]);

    console.log("Seeding complete with updated images!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seed();
