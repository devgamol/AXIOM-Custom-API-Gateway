const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    key: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'API Key name is required'],
        trim: true
    },
    // SaaS API Definition Fields
    apiName: {
        type: String,
        trim: true
    },
    baseUrl: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    version: {
        type: String,
        default: '1.0.0'
    },
    healthPath: {
        type: String,
        default: '/health'
    },
    totalRequests: {
        type: Number,
        default: 0
    },
    blockedRequests: {
        type: Number,
        default: 0
    },
    averageLatency: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ApiKey', apiKeySchema);
