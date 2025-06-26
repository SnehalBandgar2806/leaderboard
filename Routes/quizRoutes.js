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
// POST one or multiple quizzes
router.post('/', async (req, res) => {
  try {
    const payload = req.body;

    // Check if it's an array
    if (Array.isArray(payload)) {
      const result = await Quiz.insertMany(payload);
      return res.status(201).json({ message: "Multiple quizzes added", data: result });
    } else {
      const newQuiz = new Quiz(payload);
      await newQuiz.save();
      return res.status(201).json({ message: "Single quiz added", data: newQuiz });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to save quiz", error: error.message });
  }
});

// ✅ Update quiz by quizId
router.put('/:quizId', async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findOneAndUpdate(
      { quizId: req.params.quizId },
      req.body,
      { new: true }
    );
    if (!updatedQuiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ message: 'Quiz updated', data: updatedQuiz });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update quiz', error: err.message });
  }
});

module.exports = router;