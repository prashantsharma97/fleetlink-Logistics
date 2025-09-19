const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// POST /api/auth/login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { sub: user._id.toString(), email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(200).json({ token, expiresIn: JWT_EXPIRES_IN });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
