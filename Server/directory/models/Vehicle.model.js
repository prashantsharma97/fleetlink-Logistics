const mongoose = require('mongoose');

// Vehicle schema
const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  capacityKg: { type: Number, required: true },
  tyres: { type: Number, required: true },
}, { timestamps: true });



module.exports = mongoose.model('Vehicle', vehicleSchema);
