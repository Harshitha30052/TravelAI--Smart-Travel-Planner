require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite development ports
  credentials: true
}));
app.use(express.json());

// Database connection check middleware
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1 && req.path.startsWith('/api/')) {
    return res.status(503).json({
      message: 'Database connection is not established. Please verify that MongoDB is running and your MONGODB_URI in .env is correct.'
    });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Base route for API check
app.get('/', (req, res) => {
  res.send('TravelAI API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
