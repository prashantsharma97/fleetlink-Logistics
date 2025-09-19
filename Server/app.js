const express = require('express');
const cors = require('cors');
const vehiclesRoutes = require('./directory/routes/vehicles.routes');
const bookingsRoutes = require('./directory/routes/bookings.routes');
const authRoutes = require('./directory/routes/auth.routes');
const connectDB = require('./config/db');

const port = process.env.PORT || 4000;

require('dotenv').config(); 
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use(vehiclesRoutes);
app.use(bookingsRoutes);
app.use(authRoutes);


// simple error handler..
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

(async () => {
  await connectDB();
  app.listen(port, () => console.log(`Server running on port ${port}`));
})();

module.exports = app;
