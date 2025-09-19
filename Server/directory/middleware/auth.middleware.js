const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or malformed' });
    }
    const token = auth.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user; 
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = authMiddleware;
