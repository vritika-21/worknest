const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  message: String,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);