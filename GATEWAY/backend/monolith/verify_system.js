const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function runVerification() {
    console.log('🚀 Starting System Verification...');

    let token = '';
    let userId = '';

    try {
        // 0. Authenticate
        console.log('\n0️⃣  Authenticating...');
        const email = `test${Date.now()}@example.com`;
        const password = 'password123';

        try {
            await axios.post(`${BASE_URL}/auth/register`, {
                name: 'Test User',
                email,
                password
            });
        } catch (e) {
            // Ignore if already exists (unlikely with timestamp)
        }

        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password
        });

        token = loginRes.data.data.token;
        userId = loginRes.data.data.user.id;
        console.log('   ✅ Authenticated');

        const authHeaders = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 1. Create API Key
        console.log('\n1️⃣  Creating API Key...');
        const apiKeyRes = await axios.post(`${BASE_URL}/apikeys`, {
            userId,
            name: 'Verification API',
            apiName: 'Verification Service',
            baseUrl: 'http://localhost:5000', // Point to self for test
            description: 'Automated test api',
            version: '1.0.0',
            healthPath: '/health'
        }, authHeaders);

        const apiKey = apiKeyRes.data.data.key;
        const apiKeyId = apiKeyRes.data.data._id;
        console.log(`   ✅ API Key created: ${apiKey}`);

        // 2. Create Service
        console.log('\n2️⃣  Creating Service...');
        const serviceName = `Test Service ${Date.now()}`;
        const serviceRes = await axios.post(`${BASE_URL}/services`, {
            apiKey: apiKey,
            name: serviceName,
            baseUrl: 'http://localhost:5000', // Pointing to itself for test
            healthPath: '/health'
        }, authHeaders);
        const serviceId = serviceRes.data.data._id;
        console.log(`   ✅ Service created: ${serviceRes.data.data.name}`);

        // 3. Create Route
        console.log('\n3️⃣  Creating Route...');
        const routeRes = await axios.post(`${BASE_URL}/routes`, {
            apiKey: apiKey,
            path: '/test-proxy',
            method: 'GET',
            serviceId: serviceId,
            destinationPath: '/health' // Forward to health endpoint
        }, authHeaders);
        const routeId = routeRes.data.data._id;
        console.log(`   ✅ Route created: ${routeRes.data.data.path}`);

        // 4. Send Traffic (Proxy)
        console.log('\n4️⃣  Sending Traffic to Proxy...');
        console.log('   ⏳ Waiting 15s for service health check...');
        await new Promise(r => setTimeout(r, 15000));

        const proxyUrl = `${BASE_URL}/proxy/${apiKey}/test-proxy`;

        for (let i = 0; i < 5; i++) {
            await axios.get(proxyUrl);
            process.stdout.write('.');
        }
        console.log('\n   ✅ Sent 5 requests');

        // Wait for buffer flush (5s)
        console.log('   ⏳ Waiting 6s for metrics flush...');
        await new Promise(r => setTimeout(r, 6000));

        // 5. Verify Metrics
        console.log('\n5️⃣  Verifying Metrics...');
        const metricsRes = await axios.get(`${BASE_URL}/api/${apiKey}/stats`, authHeaders);
        const stats = metricsRes.data.data; // Response is { success: true, data: { ... } }

        if (stats.totalRequests >= 5) {
            console.log(`   ✅ Metrics updated: ${stats.totalRequests} requests`);
        } else {
            console.error(`   ❌ Metrics mismatch: expected >= 5, got ${stats.totalRequests}`);
        }

        if (stats.timeseries.length > 0) {
            console.log(`   ✅ Timeseries data present: ${stats.timeseries.length} buckets`);
        } else {
            console.error('   ❌ No timeseries data found');
        }

        // 6. Verify Logs
        console.log('\n6️⃣  Verifying Logs...');
        const logsRes = await axios.get(`${BASE_URL}/api/${apiKey}/logs`, authHeaders);
        if (logsRes.data.data.logs.length >= 5) {
            console.log(`   ✅ Logs found: ${logsRes.data.data.logs.length} entries`);
        } else {
            console.error(`   ❌ Logs missing: expected >= 5, got ${logsRes.data.data.logs.length}`);
        }

        // 7. Verify Rate Limiting
        console.log('\n7️⃣  Verifying Rate Limiting...');
        // Create a low limit rule (using internal endpoint or just relying on global if implemented, 
        // but spec says "Rate limit rules can be global per-apiKey or per-route". 
        // We implemented in-memory check. Let's try to trigger it if we can set a limit.
        // The current implementation checks `route.rateLimit` or `apiKey.rateLimit`.
        // Let's update the route to        // Update route limit
        await axios.put(`${BASE_URL}/routes/${routeId}`, {
            apiKey: apiKey,
            path: '/test-proxy',
            method: 'GET',
            serviceId: serviceId,
            destinationPath: '/health',
            rateLimit: 2
        }, authHeaders);
        console.log('   ✅ Updated route limit to 2/min');

        let blocked = false;
        try {
            for (let i = 0; i < 5; i++) {
                await axios.get(proxyUrl);
            }
        } catch (err) {
            if (err.response && err.response.status === 429) {
                blocked = true;
                console.log('   ✅ Received 429 Too Many Requests');
            }
        }

        if (blocked) {
            console.log('   ✅ Rate limiting working');
        } else {
            console.error('   ❌ Rate limiting failed (no 429 received)');
        }

        // 8. Verify Health Check
        console.log('\n8️⃣  Verifying Health Check...');
        // Wait for health check cycle (10s total just to be safe)
        console.log('   ⏳ Waiting 6s for health check update...');
        await new Promise(r => setTimeout(r, 6000));

        const servicesRes = await axios.get(`${BASE_URL}/api/${apiKey}/services`, authHeaders);
        const service = servicesRes.data.data.find(s => s._id === serviceId);

        if (service && service.status === 'UP') {
            console.log(`   ✅ Service Status: ${service.status}`);
            console.log(`   ✅ Last Checked: ${service.lastChecked}`);
        } else {
            console.error(`   ❌ Service health check failed: ${service?.status}`);
        }

        console.log('\n✨ Verification Complete!');

    } catch (error) {
        console.error('\n❌ Verification Failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

runVerification();
