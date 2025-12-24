// src/data/campusLocations.js

export const campusCenter = {
  lat: 15.3692, // Central university location
  lng: 75.1217,
  zoom: 18,
};

export const campusLocations = [
  {
    id: 1,
    name: "KLE Technological University",
    category: "Academic",
    coordinates: { lat: 15.36933, lng: 75.12198 },
    building: "Main Building",
    floor: "All Floors",
    description: "Central hub of KLE Technological University.",
    amenities: ["WiFi", "Library", "Auditorium"],
    icon: "🏢",
    openingHours: "8:00 AM - 8:00 PM",
    imageUrl: "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    name: "Department of Electrical and Electronics Engineering",
    category: "Academic",
    coordinates: { lat: 15.36962, lng: 75.12274 },
    building: "EEE Block",
    floor: "All Floors",
    description:
      "Department of Electrical and Electronics Engineering with labs and classrooms.",
    amenities: ["Labs", "WiFi"],
    icon: "💡",
    openingHours: "8:00 AM - 6:00 PM",
    imageUrl: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 3,
    name: "Automobile Department",
    category: "Academic",
    coordinates: { lat: 15.36994, lng: 75.12242 },
    building: "Automobile Block",
    floor: "2 Levels",
    description: "Automobile Engineering Department.",
    amenities: ["Workshops"],
    icon: "🚗",
    openingHours: "8:00 AM - 6:00 PM",
    imageUrl: "https://images.pexels.com/photos/3862632/pexels-photo-3862632.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 4,
    name: "Civil Engineering Department",
    category: "Academic",
    coordinates: { lat: 15.36866, lng: 75.12352 },
    building: "Civil Block",
    floor: "All Floors",
    description: "Civil Engineering Department.",
    amenities: ["Labs", "WiFi"],
    icon: "🏗️",
    openingHours: "8:00 AM - 5:00 PM",
    imageUrl: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 5,
    name: "School of Mechanical Engineering",
    category: "Academic",
    coordinates: { lat: 15.36924, lng: 75.12355 },
    building: "Mech Block",
    floor: "All Floors",
    description: "School of Mechanical Engineering.",
    amenities: ["Workshop"],
    icon: "⚙️",
    openingHours: "8:00 AM - 6:00 PM",
    imageUrl: "https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 6,
    name: "C-LITE",
    category: "Academic",
    coordinates: { lat: 15.37031, lng: 75.1232 },
    building: "C-LITE Block",
    floor: "Ground",
    description: "C-LITE research center.",
    amenities: ["Lab"],
    icon: "🧪",
    openingHours: "8:00 AM - 6:00 PM",
    imageUrl: "https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 7,
    name: "LHC",
    category: "Academic",
    coordinates: { lat: 15.37073, lng: 75.12241 },
    building: "Lecture Hall Complex",
    floor: "Ground",
    description: "Lecture Hall Complex (LHC).",
    amenities: ["Lecture Hall"],
    icon: "🏫",
    openingHours: "8:00 AM - 6:00 PM",
    imageUrl: "https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 8,
    name: "Deshpande Foundation",
    category: "Facilities",
    coordinates: { lat: 15.37105, lng: 75.12351 },
    building: "DF Block",
    floor: "Ground",
    description: "Deshpande Foundation innovation center.",
    amenities: ["Innovation"],
    icon: "🌱",
    openingHours: "9:00 AM - 6:00 PM",
    imageUrl: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 9,
    name: "Department of Biotechnology",
    category: "Academic",
    coordinates: { lat: 15.37059, lng: 75.12408 },
    building: "Biotech Block",
    floor: "All floors",
    description: "Department of Biotechnology.",
    amenities: ["Labs"],
    icon: "🧬",
    openingHours: "8:00 AM - 6:00 PM",
    imageUrl: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 10,
    name: "BT Auditorium",
    category: "Facilities",
    coordinates: { lat: 15.37035, lng: 75.12407 },
    building: "Auditorium",
    floor: "Ground",
    description: "BT Auditorium for events and lectures.",
    amenities: ["Stage", "Sound System"],
    icon: "🎤",
    openingHours: "8:00 AM - 8:00 PM",
    imageUrl: "https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 11,
    name: "KLE Tech. Canteen",
    category: "Facilities",
    coordinates: { lat: 15.36837, lng: 75.12261 },
    building: "Canteen Block",
    floor: "Ground",
    description: "Main campus canteen.",
    amenities: ["Food", "Beverages"],
    icon: "🍽️",
    openingHours: "8:00 AM - 6:00 PM",
    imageUrl: "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 12,
    name: "Park",
    category: "Sports",
    coordinates: { lat: 15.36876, lng: 75.12227 },
    building: "Campus Park",
    floor: "Ground",
    description: "Outdoor recreation park for students.",
    amenities: ["Green Area"],
    icon: "🌳",
    openingHours: "6:00 AM - 7:30 PM",
    imageUrl: "https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 13,
    name: "BVB Post Office",
    category: "Facilities",
    coordinates: { lat: 15.3693, lng: 75.12192 },
    building: "Post Office",
    floor: "Ground",
    description: "On-campus post office for students and faculty.",
    amenities: ["Mail Services"],
    icon: "📮",
    openingHours: "10:00 AM - 5:00 PM",
    imageUrl: "https://images.pexels.com/photos/230554/pexels-photo-230554.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

export const getLocationById = (id) =>
  campusLocations.find((loc) => loc.id === id);

/**
 * Friendlier name lookup:
 * - case-insensitive
 * - works with partial names (e.g. "Civil", "civil dept")
 */
export const getLocationByName = (name) => {
  if (!name) return null;
  const q = name.toLowerCase().trim();

  // exact match
  const exact = campusLocations.find(
    (loc) => loc.name.toLowerCase() === q
  );
  if (exact) return exact;

  // partial match
  return campusLocations.find((loc) =>
    loc.name.toLowerCase().includes(q)
  );
};

export const searchLocations = (query) => {
  const lowerQuery = query.toLowerCase();
  return campusLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(lowerQuery) ||
      loc.description.toLowerCase().includes(lowerQuery) ||
      loc.building.toLowerCase().includes(lowerQuery)
  );
};

export const categoryColors = {
  Academic: "#3b82f6",
  Facilities: "#10b981",
  Sports: "#f59e0b",
};
