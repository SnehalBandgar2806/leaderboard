const express = require('express');
const crypto = require('crypto');  // ✅ Replaces bcrypt
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../Models/Users');

// 🔐 Helper function to hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// ✅ GET total users
router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ totalUsers: count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST user (general insert without password hash)
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to save user", error: error.message });
  }
});

// ✅ GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ GET user profile by ID (with followers/following populated)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ PUT update user profile
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// ✅ POST follow another user
router.post('/:id/follow', async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!userToFollow.followers.includes(req.body.userId)) {
      userToFollow.followers.push(req.body.userId);
      currentUser.following.push(req.params.id);
      await userToFollow.save();
      await currentUser.save();
    }

    res.json({ message: "Followed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Follow error", error: error.message });
  }
});

// ✅ Register full user profile (without password)
router.post('/register', async (req, res) => {
  try {
    const {
      name, email, universityName, currentSemester,
      academicYear, branch, username, profileImage
    } = req.body;

    if (!name || !email || !username) {
      return res.status(400).json({ message: "Name, Email, and Username are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists." });
    }

    const newUser = new User({
      name,
      email,
      universityName,
      currentSemester,
      academicYear,
      branch,
      username,
      profileImage
    });

    await newUser.save();
    res.status(201).json({ message: "User profile created", user: newUser });

  } catch (error) {
    res.status(500).json({ message: "Failed to create user profile", error: error.message });
  }
});

// ✅ Signup with password hashing (authentication ready)
router.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Login and return JWT token
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
