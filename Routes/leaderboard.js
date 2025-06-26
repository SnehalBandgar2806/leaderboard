const express = require('express');
const router = express.Router();
const Leaderboard = require('../Models/Leaderboard');

// ✅ POST: Submit score
router.post('/submit', async (req, res) => {
  const { quizId, userId, name, score, timeTaken } = req.body;

  if (!quizId || !userId || !name || score == null || timeTaken == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await Leaderboard.findOneAndUpdate(
      { quizId, userId },
      { name, score, timeTaken },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Score submitted successfully' });
  } catch (err) {
    console.error('❌ Error submitting leaderboard:', err);
    res.status(500).json({ error: 'Server error while submitting' });
  }
});

// ✅ GET: Leaderboard for a quiz
router.get('/:quizId', async (req, res) => {
  const quizId = req.params.quizId;

  try {
    const entries = await Leaderboard.find({ quizId })
      .sort({ score: -1, timeTaken: 1 }); // high score first, low time better

    const formatted = entries.map((entry) => ({
      userId: entry.userId,
      name: entry.name,
      score: entry.score,
      timeTaken: entry.timeTaken,
    }));

    res.json({ count: formatted.length, leaderboard: formatted });
  } catch (err) {
    console.error('❌ Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Server error while fetching leaderboard' });
  }
});

module.exports = router;
