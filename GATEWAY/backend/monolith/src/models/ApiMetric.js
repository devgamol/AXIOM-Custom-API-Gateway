const mongoose = require('mongoose');

/**
 * ApiMetric - Stores aggregated metrics per API key
 * Auto-initialized when API key is created
 */
const apiMetricSchema = new mongoose.Schema({
    apiKey: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    totalRequests: {
        type: Number,
        default: 0
    },
    blockedRequests: {
        type: Number,
        default: 0
    },
    totalLatency: {
        type: Number,
        default: 0
    },
    avgLatency: {
        type: Number,
        default: 0
    },
    statusBreakdown: {
        '2xx': { type: Number, default: 0 },
        '4xx': { type: Number, default: 0 },
        '5xx': { type: Number, default: 0 }
    },
    // 24 hourly buckets for timeseries
    // Timeseries buckets (flexible granularity)
    timeseries: [{
        timestamp: Date,
        count: { type: Number, default: 0 },
        latency: { type: Number, default: 0 }
    }],
    routes: {
        type: Map,
        of: {
            count: Number,
            latency: Number
        },
        default: {}
    },
    serviceHealth: [{
        serviceId: mongoose.Schema.Types.ObjectId,
        name: String,
        status: String,
        latency: Number,
        lastChecked: Date
    }]
}, {
    timestamps: true
});

// Helper method to generate empty 24-hour timeseries
apiMetricSchema.statics.generateEmptyTimeseries = function () {
    const buckets = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
        buckets.push({
            hour: time.toISOString().slice(0, 13).replace('T', '-'),
            count: 0,
            timestamp: time
        });
    }

    return buckets;
};

module.exports = mongoose.model('ApiMetric', apiMetricSchema);
