const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Create MongoDB indexes for optimal query performance
 * Run this script once after deployment: node scripts/create-indexes.js
 */
async function createIndexes() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);

        const db = mongoose.connection.db;

        console.log('📊 Creating indexes...');

        // Logs Collection Indexes
        await db.collection('logs').createIndex({ timestamp: -1 });
        await db.collection('logs').createIndex({ apiKey: 1, timestamp: -1 });
        await db.collection('logs').createIndex({ statusCode: 1 });
        await db.collection('logs').createIndex({ userId: 1, timestamp: -1 });
        console.log('✅ Logs indexes created');

        // Metrics Collection Indexes
        await db.collection('metrics').createIndex({ apiKey: 1, timestamp: -1 });
        await db.collection('metrics').createIndex({ timestamp: -1 });
        console.log('✅ Metrics indexes created');

        // Routes Collection Indexes
        await db.collection('routes').createIndex({ path: 1, method: 1 });
        await db.collection('routes').createIndex({ serviceId: 1 });
        await db.collection('routes').createIndex({ isActive: 1 });
        console.log('✅ Routes indexes created');

        // Services Collection Indexes
        await db.collection('services').createIndex({ status: 1 });
        await db.collection('services').createIndex({ name: 1 }, { unique: true });
        console.log('✅ Services indexes created');

        // API Keys Collection Indexes
        await db.collection('apikeys').createIndex({ key: 1 }, { unique: true });
        await db.collection('apikeys').createIndex({ userId: 1, isActive: 1 });
        console.log('✅ API Keys indexes created');

        // Users Collection Indexes
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        console.log('✅ Users indexes created');

        console.log('\n🎉 All indexes created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating indexes:', error);
        process.exit(1);
    }
}

createIndexes();
