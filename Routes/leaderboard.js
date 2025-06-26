const express = require('express');
const router = express.Router(); // ✅ THIS LINE WAS MISSING EARLIER

const Leaderboard = require('../Models/Leaderboard');
const User = require('../Models/Users'); // assuming name is stored in Users collection

// POST: Submit score
router.post('/submit', async (req, res) => {
  const { quizId, userId, score, timeTaken, name } = req.body;

  if (!quizId || !userId || score == null || timeTaken == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await Leaderboard.findOneAndUpdate(
      { quizId, userId },
      { score, timeTaken, name },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Score submitted successfully' });
  } catch (err) {
    console.error('❌ Error submitting leaderboard:', err);
    res.status(500).json({ error: 'Server error while submitting' });
  }
});

// GET: Fetch leaderboard
router.get('/:quizId', async (req, res) => {
  const quizId = req.params.quizId;

  try {
    const leaderboardEntries = await Leaderboard.find({ quizId })
      .sort({ score: -1, timeTaken: 1 });

    const formatted = leaderboardEntries.map((entry) => ({
      userId: entry.userId,
      name: entry.name ?? 'Player',
      score: entry.score,
      timeTaken: entry.timeTaken,
    }));

    res.json({ count: formatted.length, leaderboard: formatted });
  } catch (err) {
    console.error('❌ Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Server error while fetching leaderboard' });
  }
});

module.exports = router; // ✅ THIS MUST BE PRESENT
