const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
    },
    apiKey: {
        type: String,
        index: true
    },
    avgLatency: {
        type: Number,
        default: 0
    },
    totalRequests: {
        type: Number,
        default: 0
    },
    blockedRequests: {
        type: Number,
        default: 0
    },
    statusBreakdown: {
        '2xx': { type: Number, default: 0 },
        '4xx': { type: Number, default: 0 },
        '5xx': { type: Number, default: 0 }
    },
    interval: {
        type: String,
        default: '5s'
    }
});

// Compound index for efficient queries
metricSchema.index({ apiKey: 1, timestamp: -1 });

module.exports = mongoose.model('Metric', metricSchema);
