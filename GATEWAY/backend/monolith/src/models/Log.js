const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
    },
    method: {
        type: String,
        required: true
    },
    endpoint: {
        type: String,
        required: true
    },
    statusCode: {
        type: Number,
        required: true
    },
    latency: {
        type: Number,
        required: true
    },
    apiKey: {
        type: String,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    requestBody: {
        type: mongoose.Schema.Types.Mixed
    },
    responseBody: {
        type: mongoose.Schema.Types.Mixed
    },
    blocked: {
        type: Boolean,
        default: false
    },
    error: {
        type: String
    }
});

module.exports = mongoose.model('Log', logSchema);
