require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// ✅ Middleware Setup
app.use(cors());
app.use(express.json());
app.use(helmet());

// ❌ REMOVE OR COMMENT THESE IF FILES DO NOT EXIST
// const liveUsersRoutes = require('./Routes/liveUsersRoutes');
// const quizRegistrationRoutes = require('./Routes/QuizRegistrationAPI');
// app.use('/api/quiz-registrations', quizRegistrationRoutes);
// app.use('/api/live', liveUsersRoutes);

// ✅ Rate Limiting (security)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// ✅ CORS Preflight
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!!!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Static Files (if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Import Routes
const quizRoutes = require('./Routes/quizRoutes');

// ✅ Use Routes
app.use('/api/quizzes', quizRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
