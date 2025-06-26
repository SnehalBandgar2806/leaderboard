const express = require('express');
const router = express.Router();
const Leaderboard = require('../Models/Leaderboard');
// POST: Submit score, time, and name
router.post('/submit', async (req, res) => {
  const { quizId, userId, name, score, timeTaken } = req.body;

  if (!quizId || !userId || score == null || timeTaken == null || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await Leaderboard.findOneAndUpdate(
      { quizId, userId },
      { score, timeTaken, name },  // ✅ Save name too
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Score submitted successfully' });
  } catch (err) {
    console.error('❌ Error submitting leaderboard:', err);
    res.status(500).json({ error: 'Server error while submitting' });
  }
});

// ✅ GET: Get leaderboard for a quiz
router.get('/:quizId', async (req, res) => {
  const quizId = req.params.quizId;

  try {
    const leaderboardEntries = await Leaderboard.find({ quizId })
      .sort({ score: -1, timeTaken: 1 });

    const formatted = leaderboardEntries.map((entry) => ({
      userId: entry.userId,
      name: entry.name || 'Player',
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
