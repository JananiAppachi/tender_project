import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import authRoutes from './routes/auth.js';
import tenderRoutes from './routes/tenderRequests.js';
import adminRoutes from './routes/admin.js';
import contactRoutes from './routes/contact.js';
import { createAdmin } from './utils/createAdmin.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || config.port;

// WebSocket connections store
const wsConnections = new Map();

// WebSocket server setup
wss.on('connection', (ws, req) => {
  // Parse URL properly to handle query parameters
  const urlParts = req.url.split('?')[0].split('/');
  const channel = urlParts[1] || 'default';  // Get channel name without query params
  console.log(`New WebSocket connection attempt on channel: ${channel}`);

  // Store connection with error handling
  try {
    // Validate channel name - MUST match exactly with frontend channel names
    const validChannels = ['DASHBOARD_STATS', 'TENDER_REQUESTS', 'WEBSITE_ANALYTICS'];
    if (!validChannels.includes(channel)) {
      console.error(`Invalid channel: ${channel}, valid channels are: ${validChannels.join(', ')}`);
      ws.close(1008, 'Invalid channel');
      return;
    }

    // Initialize channel if not exists
    if (!wsConnections.has(channel)) {
      wsConnections.set(channel, new Set());
    }

    // Add connection to channel
    wsConnections.get(channel).add(ws);
    console.log(`Client successfully connected to channel: ${channel}`);

    // Send initial connection success message
    ws.send(JSON.stringify({ 
      type: 'CONNECTED', 
      channel,
      timestamp: new Date().toISOString()
    }));

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        
        // Handle ping messages
        if (data.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }));
          ws.isAlive = true;
          return;
        }

        // Handle authentication
        if (data.type === 'AUTH') {
          ws.isAuthenticated = true;
          ws.send(JSON.stringify({ 
            type: 'AUTH_SUCCESS',
            timestamp: new Date().toISOString()
          }));
          return;
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });

    // Handle client disconnect
    ws.on('close', (code, reason) => {
      console.log(`Client disconnected from channel: ${channel}, code: ${code}, reason: ${reason || 'No reason provided'}`);
      wsConnections.get(channel)?.delete(ws);
      if (wsConnections.get(channel)?.size === 0) {
        wsConnections.delete(channel);
        console.log(`Channel ${channel} removed as it has no connections`);
      }
    });

    // Set up ping timeout
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });

  } catch (err) {
    console.error('Error in WebSocket connection:', err);
    ws.close(1011, 'Internal Server Error');
  }
});

// Broadcast helper function
export const broadcastToChannel = (channel, data) => {
  if (wsConnections.has(channel)) {
    wsConnections.get(channel).forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(JSON.stringify(data));
        } catch (error) {
          console.error('Failed to send message to client:', error);
        }
      }
    });
  }
};

// Ping all clients every 30 seconds
const pingInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log('Client not responding to ping, terminating connection');
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(pingInterval);
});

// Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      // Development URLs
      'http://localhost:5173',
      'http://localhost:5174',
      'ws://localhost:5173',
      'ws://localhost:5174',
      'http://localhost:5000',
      // Production URLs
      'https://dhiya-frontend.vercel.app',
      'https://dhiya-frontend.vercel.app/',
      // Preview deployment URLs
      'https://dhiya-frontend-8kw2fs9nw-jananis-projects-e76bb261.vercel.app',
      'https://dhiya-frontend-a1wcym8u4-jananis-projects-e76bb261.vercel.app',
      'https://dhiya-frontend-jh0vkuf43-jananis-projects-e76bb261.vercel.app'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      console.log('CORS blocked request from origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Health check routes (place these BEFORE other middleware)
app.get('/health', (req, res) => {
  console.log('Root health check requested from:', req.headers.origin);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  console.log('API health check requested from:', req.headers.origin);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  console.log('Root route accessed from:', req.headers.origin);
  res.status(200).json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection with retry logic and improved options
const connectDB = async (retryCount = 0) => {
  const MAX_RETRIES = 5;
  try {
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 90000,
      connectTimeoutMS: 60000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    console.log('Connected to MongoDB');
    createAdmin();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      setTimeout(() => connectDB(retryCount + 1), 5000 * Math.pow(2, retryCount));
    } else {
      console.error('Max retries reached. Could not connect to MongoDB.');
      process.exit(1);
    }
  }
};

// Set up mongoose error handlers
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected. Attempting to reconnect...');
  connectDB();
});

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tender-requests', tenderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Request headers:', req.headers);
  console.error('Request URL:', req.url);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// Start server with retry logic
const startServer = async (retryCount = 0) => {
  const maxRetries = 3;
  try {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket server is ready`);
    }).on('error', (err) => {
      console.error('Failed to start server:', err);
      if (retryCount < maxRetries) {
        console.log(`Retrying in 5 seconds... (Attempt ${retryCount + 1} of ${maxRetries})`);
        setTimeout(() => startServer(retryCount + 1), 5000);
      } else {
        console.error('Max retries reached. Could not start server.');
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    if (retryCount < maxRetries) {
      console.log(`Retrying in 5 seconds... (Attempt ${retryCount + 1} of ${maxRetries})`);
      setTimeout(() => startServer(retryCount + 1), 5000);
    } else {
      console.error('Max retries reached. Could not start server.');
      process.exit(1);
    }
  }
};

startServer();

export default app;
