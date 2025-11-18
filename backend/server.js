const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { initDB, getVault, savePassword, deletePassword, updatePassword } = require('./db');
const { generateToken, verifyToken, hashPassword, comparePassword } = require('./auth');
const passwordRoutes = require('./routes/passwords');
const pairingRoutes = require('./routes/pairing');
const devicesRoutes = require('./routes/devices');
const authRequestRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // Allow Chrome extension origins
    if (origin && origin.startsWith('chrome-extension://')) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Initialize database
initDB();

// Routes
app.use('/api/passwords', passwordRoutes);
app.use('/api/pairing', pairingRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/auth-request', authRequestRoutes);

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, masterPassword, password, name } = req.body;
    const pwd = masterPassword || password;

    if (!email || !pwd) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const hashedPassword = await hashPassword(pwd);

    // Store user (in-memory for prototype)
    const token = generateToken({ email, name });

    res.json({
      success: true,
      token,
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, masterPassword, password } = req.body;
    const pwd = masterPassword || password;

    if (!email || !pwd) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Validate credentials (simplified for prototype)
    const token = generateToken({ email });

    res.json({
      success: true,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create HTTP server
const server = http.createServer(app);

// Socket.IO server for real-time sync
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const clients = new Map(); // socketId -> { socket, userId, deviceId }

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  clients.set(socket.id, { socket, userId: null, deviceId: null });

  // Handle registration
  socket.on('message', (data) => {
    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      console.log('Received message:', parsedData);

      if (parsedData.type === 'register') {
        const clientData = clients.get(socket.id);
        if (clientData) {
          clientData.userId = parsedData.userId;
          clientData.deviceId = parsedData.deviceId;
          clients.set(socket.id, clientData);
          console.log(`Client registered: userId=${parsedData.userId}, deviceId=${parsedData.deviceId}`);
        }
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    clients.delete(socket.id);
  });

  // Send welcome message
  socket.emit('connected', {
    type: 'connected',
    message: 'Connected to BioVault server'
  });
});

// Export function to broadcast auth requests
global.broadcastAuthRequest = (userId, requestId, context) => {
  console.log(`Broadcasting auth request: userId=${userId}, requestId=${requestId}`);

  clients.forEach((clientData, socketId) => {
    if (clientData.userId === userId) {
      console.log(`Sending auth request to device: ${clientData.deviceId}`);
      clientData.socket.emit('auth-request', {
        requestId,
        context: context || 'Authentication Request',
        timestamp: Date.now()
      });
    }
  });
};

server.listen(PORT, () => {
  console.log(`BioVault server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
