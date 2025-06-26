// models/Leaderboard.js
const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // optional, only if you use populate
  },
  name: {
    type: String, // ✅ this must exist
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  timeTaken: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
