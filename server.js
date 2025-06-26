require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const liveUsersRoutes = require('./Routes/liveUsersRoutes');
const quizRegistrationRoutes = require('./Routes/QuizRegistrationAPI');
const app = express();

// ✅ Middleware Setup
app.use(cors());
app.use(express.json());
app.use(helmet());
// app.use('/api/users', userRoutes);
app.use('/api/quiz-registrations', quizRegistrationRoutes);
app.use('/api/live', liveUsersRoutes);

// ✅ Rate Limiting (security)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
});
app.use(limiter);

// ✅ CORS Preflight (optional but recommended for complex headers)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!!!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Static File Hosting (for uploads if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Import Routes
const quizRoutes = require('./Routes/quizRoutes');
const usersRoutes = require('./Routes/usersRoutes');
const authRoutes = require('./Routes/auth');
// const categoryRoutes = require('./Routes/category'); // Optional

// ✅ Use Routes
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/users/auth', authRoutes);

// app.use('/api/categories', categoryRoutes); // Optional

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});