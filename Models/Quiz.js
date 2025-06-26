const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Quiz title is required'] },
  category: String,
  description: String,
  date: { type: String, required: true },
  time: { type: String, required: true },
  maxTime: { type: String, required: true },
  maxQuestions: { type: String, required: true },
  spots: { type: String, required: true },
  prizePool: { type: String, required: true },
  entryFee: { type: String, required: true },
  shareText: String,
  is_locked: { type: Boolean, default: false },
  is_upcoming: { type: Boolean, default: true },
  quizId: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
