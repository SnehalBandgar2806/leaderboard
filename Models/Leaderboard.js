const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // ✅ use reference to User model
    ref: 'User',
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
