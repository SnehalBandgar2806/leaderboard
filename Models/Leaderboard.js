const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
  },
  userId: {
    type: String, // keep as String, not ObjectId
    required: true,
  },
  name: {
    type: String, // 🟢 ensure name is stored directly
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
