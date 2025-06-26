const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  title: {
    type: String,
    required: [true, "Quiz title is required"],
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  category: {
    type: String,
    trim: true,
    default: ""
  },
  date: {
    type: String, // or Date, if you want to enforce format
    required: true
  },
  time: {
    type: String,
    required: true
  },
  maxTime: {
    type: String,
    required: true
  },
  maxQuestions: {
    type: String,
    required: true
  },
  spots: {
    type: String,
    required: true
  },
  prizePool: {
    type: String,
    required: true
  },
  entryFee: {
    type: String,
    required: true
  },
  shareText: {
    type: String,
    default: ""
  },
  is_upcoming: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);