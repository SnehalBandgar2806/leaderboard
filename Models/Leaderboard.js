const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Quiz',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String, // save user's name at submission time
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  timeTaken: {
    type: Number,
    required: true,
  }
});

// 🧠 Prevent duplicate submissions from same user on same quiz
leaderboardSchema.index({ quizId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
