// Models/QuizRegistration.js

const mongoose = require('mongoose');

const quizRegistrationSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // 👈 refers to your user model
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuizRegistration', quizRegistrationSchema);
