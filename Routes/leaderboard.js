// Routes/leaderboard.js
const express = require('express');
const router = express.Router();
const Leaderboard = require('../Models/Leaderboard'); // your Mongoose model
const User = require('../Models/Users'); // to get user name

// POST: submit score and time
router.post('/submit', async (req, res) => {
  const { quizId, userId, score, timeTaken } = req.body;

  if (!quizId || !userId) {
    return res.status(400).json({ error: 'Missing quizId or userId' });
  }

  try {
    // Update or insert entry
    await Leaderboard.findOneAndUpdate(
      { quizId, userId },
      { score, timeTaken },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Leaderboard submission error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
