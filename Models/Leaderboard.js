// Models/Leaderboard.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderboardSchema = new Schema({
  quizId: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  timeTaken: { type: Number, required: true }, // seconds
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
