const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/auth');
const scrimRoutes = require('./routes/scrims');
const paymentRoutes = require('./routes/payments');
const leaderboardRoutes = require('./routes/leaderboard');
const settingsRoutes = require('./routes/settings');
const storeRoutes = require('./routes/store');

const app = express();
const PORT = process.env.PORT || 5000;
const server = require('http').createServer(app);

// CORS - only allow requests from our frontend apps
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));

// Initialize Socket.io early
const io = require('socket.io')(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// Middleware to attach io to req (MUST be before routes)
app.use((req, res, next) => {
  req.io = io;
  next();
});

const path = require('path');

// Middleware to parse JSON bodies
app.use(express.json());

// Global 500 Logger Monkey Patch
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    if (res.statusCode === 500) {
      const logMsg = `[${new Date().toISOString()}] 500 RETURNED for ${req.method} ${req.url} | Body: ${JSON.stringify(body)}`;
      require('fs').appendFileSync('error.log', logMsg + '\n');
      console.error('❌ 500 ERROR:', logMsg);
    }
    return originalJson.call(this, body);
  };
  next();
});

// Static folder for screenshots
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scrims', scrimRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/store', storeRoutes);

// Custom Error Logger
app.use((err, req, res, next) => {
  const fs = require('fs');
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url} - ${err.stack}\n`;
  fs.appendFileSync('error.log', log);
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: "BgmiScrim API is running 🚀" });
});

let connectedUsers = 0;

io.on('connection', (socket) => {
  const role = socket.handshake.query.role;
  const isAdmin = role === 'admin';

  if (!isAdmin) {
    connectedUsers++;
    console.log('Player connected ⚡:', socket.id, `| Active Players: ${connectedUsers}`);
    io.emit('userCount', connectedUsers);
  } else {
    console.log('Admin connected 🛠️:', socket.id);
  }

  // Immediately send the current count to the newly connected socket
  // (This ensures the admin panel shows the correct count on load)
  socket.emit('userCount', connectedUsers);

  socket.on('disconnect', () => {
    if (!isAdmin) {
      connectedUsers = Math.max(0, connectedUsers - 1);
      console.log('Player disconnected ❌:', socket.id, `| Active Players: ${connectedUsers}`);
      io.emit('userCount', connectedUsers);
    } else {
      console.log('Admin disconnected 🛠️:', socket.id);
    }
  });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bgmiscrim')
  .then(() => {
    console.log("Connected to MongoDB ✅");

    // Start Server using the 'server' instance (http + socket.io)
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} 🚀`);
    });
  })
  .catch(err => {
    console.error("MongoDB Connection Error ❌:", err);
  });

// Process-level Error Handling for unhandled async rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  require('fs').appendFileSync('error.log', `[UNHANDLED REJECTION] ${reason?.stack || reason}\n`);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  require('fs').appendFileSync('error.log', `[UNCAUGHT EXCEPTION] ${err.stack}\n`);
});
