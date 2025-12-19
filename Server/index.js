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
const server = http.createServer(app);
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Request Logger
app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.url}`);
  next();
});


const io = new Server(server, {
  cors: corsOptions
});

// Socket Authentication Middleware
io.use((socket, next) => {
    const token = socket.handshake.query.token || socket.handshake.headers['authorization'];
    
    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // { id, iat, exp }
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
});

// Socket Connection Handler
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.user.id} joined room ${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId) => {
        socket.leave(conversationId);
        console.log(`User ${socket.user.id} left room ${conversationId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.use(cors(corsOptions));

// Make io available in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

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
app.use('/api/payment' , require('./routers/paymentRoutes'))
// New Routes
app.use('/api/groups', require('./routers/groupRoutes'));
app.use('/api/conversations', require('./routers/conversationRoutes'));
app.use('/api/posts', require('./routers/postRoutes')); // For direct access/feeds
app.use('/api/events', require('./routers/eventRoutes')); // For direct access/calendars


app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(require('./controllers/errorController'));

console.log("Middleware for JSON, body-parser, and static file serving has been set up.");

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
