const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

router.post('/api/auth/login', authCtrl.login);

module.exports = router;
