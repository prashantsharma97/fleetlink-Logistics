const express = require('express');
const router = express.Router();
const vehiclesCtrl = require('../controllers/vehicles.controller');
const auth = require('../middleware/auth.middleware');

router.post('/api/vehicles',auth, vehiclesCtrl.createVehicle);
router.get('/api/vehicles/available', vehiclesCtrl.getAvailableVehicles);

module.exports = router;
