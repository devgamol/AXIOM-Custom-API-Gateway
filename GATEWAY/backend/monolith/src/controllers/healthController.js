const mongoose = require('mongoose');
const { STATUS_CODES } = require('../shared/constants');

/**
 * Health check endpoint
 * Returns comprehensive system health information
 */
exports.healthCheck = async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const memoryUsage = process.memoryUsage();

    res.status(STATUS_CODES.OK).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        database: {
            status: dbStatus,
            name: mongoose.connection.name
        },
        memory: {
            used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
            percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
        },
        environment: process.env.NODE_ENV || 'development'
    });
};

/**
 * Readiness check endpoint
 * Used by orchestration systems to determine if service is ready
 */
exports.readinessCheck = async (req, res) => {
    const isReady = mongoose.connection.readyState === 1;

    if (isReady) {
        res.status(STATUS_CODES.OK).json({
            ready: true,
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(503).json({
            ready: false,
            reason: 'Database not connected',
            timestamp: new Date().toISOString()
        });
    }
};

/**
 * Liveness check endpoint  
 * Simple check that service is alive
 */
exports.livenessCheck = async (req, res) => {
    res.status(STATUS_CODES.OK).json({
        alive: true,
        timestamp: new Date().toISOString()
    });
};
