const express = require('express');
const router = express.Router();
const User = require('../Models/Users'); // Mongoose User model

// In-memory store for live users: quizId => Map<userId, lastActiveTime>
const liveUsers = new Map();
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minute

// ✅ POST /api/live/join
router.post('/join', async (req, res) => {
  const { quizId, userId } = req.body;

  if (!quizId || !userId) {
    return res.status(400).json({ error: 'Missing quizId or userId' });
  }

  const now = Date.now();

  // 🧹 Remove the user from any other quiz they were part of
  for (const [existingQuizId, userMap] of liveUsers.entries()) {
    if (userMap.has(userId) && existingQuizId !== quizId) {
      userMap.delete(userId);
      console.log(`🔁 Removed user ${userId} from quiz ${existingQuizId}`);
    }
  }

  // Initialize Map for current quiz if not already
  if (!liveUsers.has(quizId)) {
    liveUsers.set(quizId, new Map());
  }

  liveUsers.get(quizId).set(userId, now);
  console.log(`🟢 User ${userId} joined quiz ${quizId}`);

  res.json({ success: true });
});

// ✅ GET /api/live/count/:quizId – returns live user count + names
router.get('/count/:quizId', async (req, res) => {
  const quizId = req.params.quizId;
  const now = Date.now();
  console.log(`🔍 Fetching live users for quizId: ${quizId}`);

  if (!liveUsers.has(quizId)) {
    console.log(`⚠️ No live users for quizId: ${quizId}`);
    return res.json({ count: 0, users: [] });
  }

  const users = liveUsers.get(quizId);

  // Remove inactive users
  for (const [userId, lastActive] of users) {
    if (now - lastActive > INACTIVITY_TIMEOUT) {
      users.delete(userId);
      console.log(`⛔ Removed inactive user ${userId} from quiz ${quizId}`);
    }
  }

  const activeUserIds = [...users.keys()];

  if (activeUserIds.length === 0) {
    console.log(`⚠️ All users expired for quizId: ${quizId}`);
    return res.json({ count: 0, users: [] });
  }

  try {
    // ✅ Fetch user name from MongoDB
    const userDetails = await User.find({ _id: { $in: activeUserIds } }).select('_id username');

    res.json({
      count: userDetails.length,
      users: userDetails.map(user => ({
        userId: user._id,
        name: user.username,
      })),
    });
  } catch (error) {
    console.error('❌ Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// 🆕 GET /api/live/join – for browser/dev testing
router.get('/join', (req, res) => {
  res.send('⚠️ Please use POST /api/live/join with JSON body { quizId, userId }.');
});

module.exports = router;
