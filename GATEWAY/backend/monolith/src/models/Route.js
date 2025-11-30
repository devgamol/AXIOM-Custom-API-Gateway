const mongoose = require('mongoose');
const { HTTP_METHODS, DEFAULTS } = require('../shared/constants');

const routeSchema = new mongoose.Schema({
    apiKey: {
        type: String,
        required: [true, 'API Key is required'],
        index: true
    },
    path: {
        type: String,
        required: [true, 'Path is required'],
        trim: true
    },
    method: {
        type: String,
        required: [true, 'Method is required'],
        enum: HTTP_METHODS,
        uppercase: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: [true, 'Service ID is required']
    },
    destinationPath: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    rateLimit: {
        type: Number,
        default: DEFAULTS.RATE_LIMIT
    }
}, {
    timestamps: true
});

// Indexes
routeSchema.index({ path: 1, method: 1 });
routeSchema.index({ apiKey: 1 });

module.exports = mongoose.model('Route', routeSchema);
