const Joi = require('joi');

exports.createBookingSchema = Joi.object({
  vehicleId: Joi.string().required(),
  fromPincode: Joi.string().pattern(/^\d+$/).required(),
  toPincode: Joi.string().pattern(/^\d+$/).required(),
  startTime: Joi.date().iso().required(),
  customerId: Joi.string().required()
});
