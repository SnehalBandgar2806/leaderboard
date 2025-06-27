const express = require('express');
const router = express.Router();
const Leaderboard = require('../Models/Leaderboard');
const User = require('../Models/Users'); // ✅ import user model
const mongoose = require('mongoose');

// Routes/leaderboard.js

router.post('/submit', async (req, res) => {
  const { quizId, userId, score, timeTaken } = req.body;

  if (!quizId || !userId || score == null || timeTaken == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await Leaderboard.findOneAndUpdate(
      { quizId, userId },
      { score, timeTaken }, // ✅ no name here
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Score submitted successfully' });
  } catch (err) {
    console.error('❌ Error submitting leaderboard:', err);
    res.status(500).json({ error: 'Server error while submitting' });
  }
});


router.get('/:quizId', async (req, res) => {
  const quizId = req.params.quizId;

  try {
    const leaderboardEntries = await Leaderboard.find({ quizId })
      .sort({ score: -1, timeTaken: 1 })
      .populate('userId', 'username'); // ✅ get username from Users collection

    const formatted = leaderboardEntries.map((entry) => ({
      userId: entry.userId._id,
      name: entry.userId.username || 'Player',
      score: entry.score,
      timeTaken: entry.timeTaken,
    }));

    res.json({ count: formatted.length, leaderboard: formatted });
  } catch (err) {
    console.error('❌ Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Server error while fetching leaderboard' });
  }
});

// DELETE /api/leaderboard/:quizId/:userId
router.delete('/:quizId/:userId', async (req, res) => {
  const { quizId, userId } = req.params;

  try {
    const result = await Leaderboard.deleteOne({
      quizId: quizId,
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (result.deletedCount > 0) {
      res.json({ success: true, message: 'User removed from leaderboard.' });
    } else {
      res.status(404).json({ success: false, message: 'Entry not found.' });
    }
  } catch (error) {
    console.error('Error deleting leaderboard entry:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.get('/test', (req, res) => {
  res.send('✅ Test route working');
});



module.exports = router;
