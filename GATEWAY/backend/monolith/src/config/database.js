const mongoose = require('mongoose');
const Logger = require('../shared/utils/logger');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/axiom';
        const conn = await mongoose.connect(mongoUri);

        Logger.success('DATABASE', `MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        Logger.error('DATABASE', `Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
