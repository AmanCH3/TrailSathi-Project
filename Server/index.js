const express = require('express');
require("dotenv").config();  // Ensure this is loaded early, but typically at the very top is best, user put it already there. 
// Actually, user put it at line 3. I'll just keep it simple.

const http = require("http");
const path = require("path");
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const authRoutes = require('./routers/authRoutes');
const AppError = require('./utils/appError');  // move this up too

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

connectDB();

// Global Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/trails', require('./routers/trailRoutes'));
app.use('/api/reviews', require('./routers/reviewRoutes'));
app.use('/api/users', require('./routers/userRoutes'));
app.use('/api/solo-hikes', require('./routers/soloHikeRoutes'));
app.use('/api/notifications', require('./routers/notificationRoutes'));
app.use('/api/achievements', require('./routers/achievementRoutes'));

app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(require('./controllers/errorController'));

console.log("Middleware for JSON, body-parser, and static file serving has been set up.");

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
