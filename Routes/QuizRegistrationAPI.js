// Routes/quizRegistrationRoutes.js

const express = require('express');
const router = express.Router();
const QuizRegistration = require('../Models/Quiz_Registration');
require('../Models/Quiz');   // 👈 Registers 'Quiz' model
require('../Models/Users'); // 👈 Registers 'User' model

// ✅ POST: Register for a quiz
router.post('/register', async (req, res) => {
  try {
    const { quizId, userId } = req.body;

    const existing = await QuizRegistration.findOne({ quizId, userId });
    if (existing) {
      return res.status(400).json({ message: 'User already registered for this quiz' });
    }

    const registration = new QuizRegistration({ quizId, userId });
    await registration.save();

    res.status(201).json({ message: 'Registered successfully', registration });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// ✅ GET: All registrations with quiz title and user name
router.get('/:quizId', async (req, res) => {
  try {
    const registrations = await QuizRegistration.find({ quizId: req.params.quizId })
      .populate('userId', 'name')       // 👤 Only name
      .populate('quizId', 'title');     // 🧠 Only title

    if (!registrations || registrations.length === 0) {
      return res.status(200).json({ message: 'No registrations found', data: [] });
    }

    res.status(200).json({ message: 'Registrations found', data: registrations });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch registrations', error: error.message });
  }
});

module.exports = router;
