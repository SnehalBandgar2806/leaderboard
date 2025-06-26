const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: String,
  description: String,
  date: String,       // Format: "2025-06-22"
  time: String,       // Format: "14:00"
  maxTime: String,    // e.g., "10 min"
  maxQuestions: String, // e.g., "12"
  spots: String,      // e.g., "100 Spots"
  prizePool: String,  // e.g., "₹250"
  entryFee: String,   // e.g., "₹50.00"
  shareText: String,
  is_locked: {
    type: Boolean,
    default: false,
  },
  is_upcoming: {
    type: Boolean,
    default: true,
  },
  quizId: {
    type: String,
    unique: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
