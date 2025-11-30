// models/Service.js

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    apiKey: {
        type: String,
        required: [true, 'API Key is required'],
        index: true
    },
    name: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true
    },
    baseUrl: {
        type: String,
        required: [true, 'Base URL is required'],
        trim: true
    },
    healthPath: {
        type: String,
        default: '/',
        trim: true
    },
    status: {
        type: String,
        enum: ['UP', 'DOWN', 'UNKNOWN'],
        default: 'UNKNOWN'
    },
    latency: {
        type: Number,
        default: 0
    },
    lastChecked: {
        type: Date
    },
    avgLatency: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true
    },

    // -----------------------
    // ✔ The missing field
    // -----------------------
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }

}, {
    timestamps: true
});

serviceSchema.index({ apiKey: 1, name: 1 });

module.exports = mongoose.model('Service', serviceSchema);
