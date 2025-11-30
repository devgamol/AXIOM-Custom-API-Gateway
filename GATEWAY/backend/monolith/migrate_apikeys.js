const mongoose = require('mongoose');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const ApiKey = require('./src/models/ApiKey');
const ApiMetric = require('./src/models/ApiMetric');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/axiom';

const generateApiKey = () => crypto.randomBytes(32).toString('hex');

async function migrate() {
    console.log('🚀 Starting API Key Migration...');

    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const apiKeys = await ApiKey.find({});
        const mapping = [];
        let updatedCount = 0;

        for (const key of apiKeys) {
            let updated = false;

            // 1. Generate secure key if missing or short
            if (!key.key || key.key.length < 32) {
                const oldKey = key.key;
                key.key = generateApiKey();
                console.log(`   🔄 Updated key for ${key.name}: ${oldKey} -> ${key.key}`);
                updated = true;
            }

            // 2. Set apiName if missing
            if (!key.apiName) {
                key.apiName = key.name;
                updated = true;
            }

            // 3. Set default version if missing
            if (!key.version) {
                key.version = '1.0.0';
                updated = true;
            }

            // 4. Set default healthPath if missing
            if (!key.healthPath) {
                key.healthPath = '/health';
                updated = true;
            }

            // 5. Ensure Metrics exist
            const metrics = await ApiMetric.findOne({ apiKey: key.key });
            if (!metrics) {
                await ApiMetric.create({
                    apiKey: key.key,
                    totalRequests: 0,
                    blockedRequests: 0,
                    timeseries: [],
                    routes: {}
                });
                console.log(`   📊 Initialized metrics for ${key.name}`);
            }

            if (updated) {
                await key.save();
                updatedCount++;
                mapping.push({
                    name: key.name,
                    id: key._id,
                    newKey: key.key
                });
            }
        }

        console.log(`\n✅ Migration Complete. Updated ${updatedCount} API keys.`);

        if (mapping.length > 0) {
            const mappingPath = path.join(__dirname, 'migration-apiKey-mapping.json');
            fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
            console.log(`📄 Mapping file saved to: ${mappingPath}`);
        }

    } catch (error) {
        console.error('❌ Migration Failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
