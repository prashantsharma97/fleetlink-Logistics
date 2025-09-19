const Joi = require('joi');

exports.createVehicleSchema = Joi.object({
  name: Joi.string().required(),
  capacityKg: Joi.number().required(),
  tyres: Joi.number().required()
});
