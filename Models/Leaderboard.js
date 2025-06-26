const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true }, // ✅ Include this
  score: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
