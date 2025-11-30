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
const PORT = process.env.PORT || 5000;

// Initialize metrics buffer
const metricsBuffer = new MetricsBuffer();

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

/* ------------------  FIXED: SETTINGS ROUTE PLACED HERE  ------------------ */
const settingsRoutes = require('./routes/settings');
app.use('/settings', settingsRoutes);
/* -------------------------------------------------------------------------- */

// Health Endpoints (no auth required)
app.get('/health', healthController.healthCheck);
app.get('/healthz', healthController.healthCheck);
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

// Public Proxy Route
app.use('/proxy', gatewayRoutes(metricsBuffer));

// Health check mirror
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        service: 'axiom-monolith',
        uptime: process.uptime()
    });
});

// Error handler
app.use(errorHandler);

// Background job: Flush metrics every 5 seconds
const flushInterval = setInterval(() => {
    if (metricsBuffer.hasData()) {
        const snapshots = metricsBuffer.flushMetrics();

        Logger.info('MONOLITH', `Flushing metrics for ${snapshots.length} APIs`);

        snapshots.forEach(snapshot => {
            sendMetrics(snapshot);
        });
    }
}, DEFAULTS.METRICS_FLUSH_INTERVAL || 5000);

// Graceful shutdown
process.on('SIGTERM', () => {
    Logger.info('MONOLITH', 'SIGTERM received, shutting down gracefully');
    clearInterval(flushInterval);

    if (metricsBuffer.hasData()) {
        const snapshot = metricsBuffer.flushMetrics();
        sendMetrics(snapshot);
    }

    process.exit(0);
});

// Start server
const startServer = async () => {
    try {
        connectDB().then(() => {
            startHealthChecker();
            Logger.success('[Server] Health checker started');
        }).catch(err => {
            Logger.error('[Server] Database connection failed:', err);
            process.exit(1);
        });

        app.listen(PORT, () => {
            Logger.success('MONOLITH', `🚀 Axiom Monolith running on port ${PORT}`);
            Logger.success('MONOLITH', '📡 Services running with correct CORS configuration');
        });
    } catch (error) {
        Logger.error('MONOLITH', `Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
