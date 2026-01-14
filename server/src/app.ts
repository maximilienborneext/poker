import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { setupSocketHandlers } from './socket/handlers.js';

// Rate limiter - moderate limits
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/v1', routes);

// Setup Socket handlers
setupSocketHandlers(io);

// Start server
httpServer.listen(config.port, () => {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║         Pointing Poker - France TV                ║');
  console.log('╠═══════════════════════════════════════════════════╣');
  console.log('║  Service          │  Port                         ║');
  console.log('╠───────────────────┼───────────────────────────────╣');
  console.log(`║  Serveur API      │  ${config.port}                          ║`);
  console.log('║  Client (Vite)    │  5173                         ║');
  console.log('║  PostgreSQL       │  5433 (ext) : 5432 (int)      ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log(`\nEnvironment: ${config.nodeEnv}`);
});
