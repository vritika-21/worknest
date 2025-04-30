const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB datbase connected!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the server if DB connection fails
  }
};

module.exports = connectDB;