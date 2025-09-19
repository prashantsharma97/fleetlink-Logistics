const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const Vehicle = require('../models/Vehicle.model');

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
});

test("POST /api/vehicles - should create vehicle", async () => {
  const res = await request(app)
    .post("/api/vehicles")
    .send({ name: "Test Truck", capacityKg: 2000, tyres: 6 });

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty("_id");
  expect(res.body.name).toBe("Test Truck");
});

test("GET /api/vehicles/available - should return vehicles with duration", async () => {
  await Vehicle.create({ name: "V1", capacityKg: 1500, tyres: 4 });
  const startTime = new Date().toISOString();

  const res = await request(app)
    .get("/api/vehicles/available")
    .query({
      capacityRequired: 500,
      fromPincode: "110001",
      toPincode: "110005",
      startTime
    });

  expect(res.statusCode).toBe(200);
  expect(res.body[0]).toHaveProperty("estimatedRideDurationHours");
  expect(res.body[0].estimatedRideDurationHours).toBe(4); // 5 - 1 = 4 % 24
});
