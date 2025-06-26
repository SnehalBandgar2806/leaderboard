const express = require('express');
const router = express.Router();
const Quiz = require('../Models/Quiz');

// GET all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST new quiz
router.post('/', async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to save quiz", error: error.message });
  }
});

module.exports = router;
