const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const Vehicle = require('../models/Vehicle.model');
const Booking = require('../models/Booking.model');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Vehicle.deleteMany({});
  await Booking.deleteMany({});
});

test("POST /api/bookings - should create booking", async () => {
  const vehicle = await Vehicle.create({ name: "Truck1", capacityKg: 2000, tyres: 6 });
  const startTime = new Date().toISOString();

  const res = await request(app)
    .post("/api/bookings")
    .send({
      vehicleId: vehicle._id.toString(),
      fromPincode: "110001",
      toPincode: "110005",
      startTime,
      customerId: "cust001"
    });

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty("_id");
});

test("POST /api/bookings - should fail if overlapping booking exists", async () => {
  const vehicle = await Vehicle.create({ name: "Truck2", capacityKg: 2000, tyres: 6 });
  const startTime = new Date("2025-09-20T10:00:00Z");

  await Booking.create({
    vehicleId: vehicle._id,
    customerId: "cust001",
    fromPincode: "110001",
    toPincode: "110005",
    startTime,
    endTime: new Date("2025-09-20T14:00:00Z")
  });

  const res = await request(app)
    .post("/api/bookings")
    .send({
      vehicleId: vehicle._id.toString(),
      fromPincode: "110001",
      toPincode: "110005",
      startTime: startTime.toISOString(),
      customerId: "cust002"
    });

  expect(res.statusCode).toBe(409);
});
