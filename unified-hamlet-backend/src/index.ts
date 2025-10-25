import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

// Import routes
import candidateRoutes from './routes/candidates.js';
import socialRoutes from './routes/social.js';
import civicRoutes from './routes/civic.js';
import authRoutes from './routes/auth.js';
import healthRoutes from './routes/health.js';

// Load environment variables
dotenv.config();

// Initialize Prisma Client
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Initialize Express app
const app = express();
const PORT = Number(process.env.PORT) || 4001;

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
if (process.env.NODE_ENV === 'development') {
  allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(null, process.env.NODE_ENV === 'development'); // Allow in dev, block in prod
    }
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// API Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/civic', civicRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Unified Hamlet Backend API',
    version: '1.0.0',
    description: 'Iraqi Election Platform - 7,769 Candidates + Social Features',
    endpoints: {
      health: '/health',
      api: '/api',
      documentation: '/api/docs (coming soon)',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Unified Hamlet Backend listening on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
  logger.info(`📡 API available at http://localhost:${PORT}/api`);
});

export default app;
