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
