// backend/monolith/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const { errorHandler } = require('./shared/utils/errorHandler');
const Logger = require('./shared/utils/logger');
const { DEFAULTS } = require('./shared/constants');
const MetricsBuffer = require('./utils/metricsBuffer');
const { sendMetrics } = require('./services/internalServices');

// Import Routes
const authRoutes = require('./routes/auth');
const apiKeyRoutes = require('./routes/apikeys');
const serviceRoutes = require('./routes/services');
const routeRoutes = require('./routes/routes');
const rateLimitRoutes = require('./routes/ratelimit');
const logRoutes = require('./routes/logs');
const metricRoutes = require('./routes/metrics');
const gatewayRoutes = require('./routes/gateway');
const dashboardRoutes = require('./routes/dashboard');
const apiRoutes = require('./routes/api');

// Import Controllers
const healthController = require('./controllers/healthController');

// Import Services
const { startHealthChecker } = require('./services/healthChecker');

const app = express();

// ----- CONFIG -----
const PORT = process.env.PORT || 5000;
const METRICS_FLUSH_INTERVAL = DEFAULTS.METRICS_FLUSH_INTERVAL || 5000;
// ------------------

/**
 * Metrics buffer instance (kept in module scope so it's shared across handler calls
 * when the runtime keeps the lambda/container warm).
 */
const metricsBuffer = new MetricsBuffer();

/**
 * Lazy DB connection guard.
 * - In serverless environments we want to connect on first request (and reuse
 *   connection while the container is warm).
 * - In local/server mode we'll call connectDB() explicitly when starting the server.
 */
let _dbConnected = false;
async function ensureDbConnected() {
  if (_dbConnected) return;
  await connectDB();
  _dbConnected = true;
}

/* ------------------------
   MIDDLEWARE & ROUTES
   ------------------------ */

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));

// Request Logging Middleware
app.use((req, res, next) => {
  Logger.info('ACCESS', `${req.method} ${req.url}`);
  next();
});

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ------------------  SETTINGS ROUTE  ------------------ */
const settingsRoutes = require('./routes/settings');
app.use('/settings', settingsRoutes);
/* ----------------------------------------------------- */

// Health Endpoints (no auth required)
app.get('/health', healthController.healthCheck);
app.get('/healthz', healthController.readinessCheck);
app.get('/readyz', healthController.readinessCheck);
app.get('/livez', healthController.livenessCheck);

// Public Routes
app.use('/auth', authRoutes);

// Protected Routes (authentication inside each file)
app.use('/dashboard', dashboardRoutes);
app.use('/api', apiRoutes);
app.use('/apikeys', apiKeyRoutes);
app.use('/services', serviceRoutes);
app.use('/routes', routeRoutes);
app.use('/ratelimit', rateLimitRoutes);
app.use('/logs', logRoutes);
app.use('/metrics', metricRoutes);

// Public Proxy Route (gatewayRoutes expects the metricsBuffer instance)
app.use('/proxy', gatewayRoutes(metricsBuffer));

// Error handler (keep last)
app.use(errorHandler);

/* ------------------------
   SERVER / HANDLER EXPORTS
   ------------------------ */

/**
 * Serverless handler for platforms that import this module.
 * Vercel (and other serverless platforms) can use this as the request handler.
 *
 * Important:
 *  - Ensures DB connection on first request.
 *  - Does NOT start background intervals or listeners (those run only when
 *    we explicitly start the server locally).
 */
async function serverlessHandler(req, res) {
  try {
    await ensureDbConnected();
    // Express app is a compatible request handler (function), so call it directly.
    return app(req, res);
  } catch (err) {
    Logger.error('HANDLER', 'Failed to handle request:', err);
    // If DB connect failed, respond with 500
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Export the app (useful for tests) and the handler (useful for serverless platforms)
module.exports = app;
module.exports.handler = serverlessHandler;

/* ------------------------
   LOCAL SERVER BOOT (when run directly)
   ------------------------ */

/**
 * startServer() is used when running the app locally (node server.js).
 * It:
 *  - connects to DB
 *  - starts health checker
 *  - starts background metrics flush interval
 *  - listens on PORT
 *  - sets graceful shutdown handlers
 */
const startServer = async () => {
  try {
    // Connect DB once for local server mode
    await connectDB();
    _dbConnected = true;

    // Start health checker service (your existing service)
    startHealthChecker();
    Logger.success('[Server] Health checker started');

    // Background job: Flush metrics every METRICS_FLUSH_INTERVAL milliseconds
    const flushInterval = setInterval(() => {
      if (metricsBuffer.hasData()) {
        const snapshots = metricsBuffer.flushMetrics();

        Logger.info('MONOLITH', `Flushing metrics for ${snapshots.length} APIs`);

        snapshots.forEach(snapshot => {
          try {
            sendMetrics(snapshot);
          } catch (err) {
            Logger.error('MONOLITH', 'Failed to send metrics snapshot:', err);
          }
        });
      }
    }, METRICS_FLUSH_INTERVAL);

    // Graceful shutdown handlers for local server
    const shutdown = async () => {
      Logger.info('MONOLITH', 'Shutdown initiated');
      clearInterval(flushInterval);

      try {
        if (metricsBuffer.hasData()) {
          const snapshot = metricsBuffer.flushMetrics();
          await sendMetrics(snapshot);
        }
      } catch (err) {
        Logger.error('MONOLITH', 'Error flushing metrics on shutdown:', err);
      }

      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    // Start HTTP listener
    app.listen(PORT, () => {
      Logger.success('MONOLITH', `🚀 Axiom Monolith running on port ${PORT}`);
      Logger.success('MONOLITH', '📡 Services running with correct CORS configuration');
    });
  } catch (error) {
    Logger.error('MONOLITH', `Failed to start server: ${error.message || error}`);
    process.exit(1);
  }
};

/**
 * If this file is executed directly (node server.js), start the server.
 * If it's imported (require/import), do NOT start the listener or background jobs.
 */
if (require.main === module) {
  startServer();
}
