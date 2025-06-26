const express = require('express');
const router = express.Router();
const User = require('../Models/Users'); 

const liveUsers = new Map(); // quizId => Map<userId, lastActive>
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

// ✅ POST: User joins a quiz live
router.post('/join', async (req, res) => {
  const { quizId, userId } = req.body;

  if (!quizId || !userId) {
    return res.status(400).json({ error: 'Missing quizId or userId' });
  }

  // ✅ Check if user exists
  const userExists = await User.findById(userId);
  if (!userExists) {
    return res.status(404).json({ error: 'User does not exist in database' });
  }

  const now = Date.now();

  // 🧹 Remove the user from any other quiz they were part of
  for (const [existingQuizId, userMap] of liveUsers.entries()) {
    if (userMap.has(userId) && existingQuizId !== quizId) {
      userMap.delete(userId);
    }
  }

  // ✅ Add to current quiz
  if (!liveUsers.has(quizId)) {
    liveUsers.set(quizId, new Map());
  }

  liveUsers.get(quizId).set(userId, now);

  res.json({ message: 'User joined live quiz successfully' });
});


// ✅ GET: Live users for a quiz
router.get('/users/:quizId', async (req, res) => {
  const { quizId } = req.params;
  const now = Date.now();

  if (!liveUsers.has(quizId)) {
    return res.json({ count: 0, users: [] });
  }

  const usersMap = liveUsers.get(quizId);

  for (const [uid, lastActive] of usersMap) {
    if (now - lastActive > INACTIVITY_TIMEOUT) {
      usersMap.delete(uid);
    }
  }

  const activeUserIds = [...usersMap.keys()];
  const userDetails = await User.find({ _id: { $in: activeUserIds } }).select('name username profileImage');

  res.json({
    count: userDetails.length,
    users: userDetails
  });
});

// 🧹 Periodic Cleanup (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [quizId, userMap] of liveUsers.entries()) {
    for (const [userId, lastActive] of userMap) {
      if (now - lastActive > INACTIVITY_TIMEOUT) {
        userMap.delete(userId);
        console.log(`🧹 Removed inactive user ${userId} from quiz ${quizId}`);
      }
    }

    // If no users left in this quiz, delete the map
    if (userMap.size === 0) {
      liveUsers.delete(quizId);
    }
  }
}, 5 * 60 * 1000); // 5 minutes

module.exports = router;
