const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle.model");
const Booking = require("../models/Booking.model");
const { calcEstimatedRideDurationHours } = require("../services/rideDuration.service");
const { createVehicleSchema } = require("../validators/vehicles.validator");

exports.createVehicle = async (req, res) => {
  try {
    const { error } = createVehicleSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { name, capacityKg, tyres } = req.body;

    const existing = await Vehicle.findOne({ name, capacityKg, tyres });
    if (existing) {
      return res.status(409).json({ error: "Vehicle already exists" });
    }

    const vehicle = await Vehicle.create({ name, capacityKg, tyres });
    return res.status(201).json(vehicle);
  } catch (err) {
    console.error("Error creating vehicle:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ error: "Missing query params" });
    }

    const durationHours = calcEstimatedRideDurationHours(fromPincode, toPincode);
    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

    const vehicles = await Vehicle.find({ capacityKg: { $gte: Number(capacityRequired) } });
    const vehicleIds = vehicles.map((v) => v._id);

    const conflicts = await Booking.find({
      vehicleId: { $in: vehicleIds.map((id) => new mongoose.Types.ObjectId(id)) },
      startTime: { $lt: end },
      endTime: { $gt: start },
    }).select("vehicleId");

    const conflictedIds = new Set(conflicts.map((c) => String(c.vehicleId)));

    const available = vehicles
      .filter((v) => !conflictedIds.has(String(v._id)))
      .map((v) => ({
        id: v._id,
        name: v.name,
        capacityKg: v.capacityKg,
        tyres: v.tyres,
        estimatedRideDurationHours: durationHours,
      }));

    return res.status(200).json(available);
  } catch (err) {
    console.error("Error fetching available vehicles:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
