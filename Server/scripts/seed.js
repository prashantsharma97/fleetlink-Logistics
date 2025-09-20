const connectDB = require('../config/db');
const Vehicle = require('../directory/models/Vehicle.model');
const User = require('../directory/models/User.model');
const bcrypt = require('bcrypt');
require('dotenv').config();

(async () => {
  try {
    await connectDB();
    await Vehicle.deleteMany({});
    await Vehicle.create([
      { name: 'Tata Abc', capacityKg: 1500, tyres: 4 },
      { name: 'Tata 407', capacityKg: 3500, tyres: 6 },
      { name: 'Ashok Leyland', capacityKg: 5000, tyres: 6 },
      { name: 'Eicher E2', capacityKg: 5000, tyres: 6 },
    ]);
    console.log('Seeded vehicles');

    const email = "admin@gmail.com";
    const plainPassword = "123456";

    let user = await User.findOne({ email });
    if (user) {
      console.log("Admin already exists:", email);
    } else {
      const passwordHash = await bcrypt.hash(plainPassword, 10);
      user = await User.create({
        name: "Admin",
        email,
        passwordHash
      });
      console.log("Admin created:", email);
    }
    process.exit(0);
  } catch (err) {
    console.error("Error in seeding:", err);
    process.exit(1);
  }
})();
