const mongoose = require('mongoose');

/**
 * RateLimit - Defines rate limiting rules per API key or per route
 */
const rateLimitSchema = new mongoose.Schema({
    apiKey: {
        type: String,
        required: true,
        index: true
    },
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        index: true
    },
    limitPerMinute: {
        type: Number,
        required: true,
        default: 60
    },
    windowSeconds: {
        type: Number,
        default: 60
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Compound index for quick lookups
rateLimitSchema.index({ apiKey: 1, routeId: 1 });

module.exports = mongoose.model('RateLimit', rateLimitSchema);
