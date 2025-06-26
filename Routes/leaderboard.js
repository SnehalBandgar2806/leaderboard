const express = require('express');
const router = express.Router();
const Leaderboard = require('../Models/Leaderboard'); // Mongoose Leaderboard model
const User = require('../Models/Users'); // User model to fetch name

router.post('/submit', async (req, res) => {
  const { quizId, userId, score, timeTaken } = req.body;

  if (!quizId || !userId || score == null || timeTaken == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 🔍 Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ Save or update leaderboard entry
    await Leaderboard.findOneAndUpdate(
      { quizId, userId: user._id },
      { score, timeTaken, userId: user._id },
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
      .sort({ score: -1, timeTaken: 1 }) // highest score first, then least time
      .populate('userId', 'name'); // Get user's name from User collection

    const formatted = leaderboardEntries.map((entry) => ({
      userId: entry.userId._id,
      name: entry.userId.name,
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
