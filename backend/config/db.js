const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travelai', {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    const { seedDestinations } = require('../utils/seedData');
    await seedDestinations();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.log('Server is running, but database features will be unavailable until MongoDB is started.');
  }
};

module.exports = connectDB;
