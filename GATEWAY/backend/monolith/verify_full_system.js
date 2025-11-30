#!/usr/bin/env node

/**
 * Comprehensive System Verification Script
 * Tests all critical system functionality
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
let testResults = [];
let authToken = '';
let testUserId = '';
let testApiKey = '';
let testServiceId = '';
let testRouteId = '';

// Configure axios to include token
const api = axios.create({
    baseURL: BASE_URL
});

// Update token interceptor
api.interceptors.request.use(config => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

// Colors for output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, passed, details = '') {
    const status = passed ? '✓' : '✗';
    const color = passed ? 'green' : 'red';
    log(`${status} ${name}${details ? ': ' + details : ''}`, color);
    testResults.push({ name, passed, details });
}

async function test(name, fn) {
    try {
        await fn();
        logTest(name, true);
        return true;
    } catch (error) {
        const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;
        logTest(name, false, errorDetails);
        return false;
    }
}

// Test 1: Health Check
async function testHealthCheck() {
    await test('Health Check', async () => {
        const response = await api.get('/health');
        if (response.data.status !== 'UP') throw new Error('Server not healthy');
    });
}

// Test 2: User Registration
async function testUserRegistration() {
    await test('User Registration', async () => {
        const response = await api.post('/auth/register', {
            name: 'Test User',
            email: `test_${Date.now()}@example.com`,
            password: 'Test123!@#'
        });
        if (!response.data.success) throw new Error('Registration failed');
        authToken = response.data.data.token;
        testUserId = response.data.data.user.id;
    });
}

// Test 3: User Login
async function testUserLogin() {
    await test('User Login', async () => {
        const response = await api.post('/auth/login', {
            email: `test_${Date.now()}@example.com`,
            password: 'Test123!@#'
        });
        if (!response.data.success) throw new Error('Login failed');
    });
}

// Test 4: API Key Creation
async function testApiKeyCreation() {
    await test('API Key Creation', async () => {
        const response = await api.post('/apikeys', {
            userId: testUserId,
            name: 'Test API Key',
            apiName: 'Test API',
            description: 'Testing API key creation'
        });
        if (!response.data.success) throw new Error('API key creation failed');
        testApiKey = response.data.data.key;
        log(`Created API Key: ${testApiKey}`, 'green');
    });
}

// Test 5: Service Creation
async function testServiceCreation() {
    await test('Service Creation', async () => {
        const response = await api.post('/services', {
            apiKey: testApiKey,
            name: `Test Service ${Date.now()}`,
            baseUrl: 'https://jsonplaceholder.typicode.com',
            healthPath: '/posts/1',
            description: 'Test service'
        });
        if (!response.data.success) throw new Error('Service creation failed');
        testServiceId = response.data.data._id;
    });
}

// Test 6: Route Creation
async function testRouteCreation() {
    await test('Route Creation', async () => {
        const response = await api.post('/routes', {
            apiKey: testApiKey,
            path: '/test',
            method: 'GET',
            serviceId: testServiceId,
            destinationPath: '/posts/1',
            rateLimit: 100
        });
        if (!response.data.success) throw new Error('Route creation failed');
        testRouteId = response.data.data._id;
    });
}

// Test 7: Proxy Request (Success)
async function testProxyRequest() {
    // Wait for health check to update
    await new Promise(resolve => setTimeout(resolve, 12000));

    await test('Proxy Request (Success)', async () => {
        const response = await api.get(`/proxy/${testApiKey}/test`);
        if (response.status !== 200) throw new Error('Proxy request failed');
    });
}

// Test 8: Metrics Update
async function testMetricsUpdate() {
    // Wait for metrics flush
    await new Promise(resolve => setTimeout(resolve, 6000));

    await test('Metrics Update', async () => {
        const response = await api.get(`/metrics/${testApiKey}`);
        if (!response.data.success) throw new Error('Metrics fetch failed');
        if (response.data.data.totalRequests === 0) throw new Error('Metrics not updated');
    });
}

// Test 9: Logs Creation
async function testLogsCreation() {
    await test('Logs Creation', async () => {
        const response = await api.get(`/logs?apiKey=${testApiKey}`);
        if (!response.data.success) throw new Error('Logs fetch failed');
        if (response.data.data.length === 0) throw new Error('No logs created');
    });
}

// Test 10: Rate Limiting
async function testRateLimiting() {
    await test('Rate Limiting (429 after limit)', async () => {
        const promises = [];
        for (let i = 0; i < 105; i++) {
            promises.push(api.get(`/proxy/${testApiKey}/test`).catch(e => e.response));
        }
        const responses = await Promise.all(promises);
        const blocked = responses.filter(r => r && r.status === 429);
        if (blocked.length === 0) throw new Error('Rate limiting not working');
    });
}

// Run all tests
async function runAll() {
    log('\n========================================', 'yellow');
    log('System Verification Test Suite', 'yellow');
    log('========================================\n', 'yellow');

    await testHealthCheck();
    await testUserRegistration();
    await testApiKeyCreation();
    await testServiceCreation();
    await testRouteCreation();
    await testProxyRequest();
    await testMetricsUpdate();
    await testLogsCreation();
    await testRateLimiting();

    log('\n========================================', 'yellow');
    log('Test Summary', 'yellow');
    log('========================================', 'yellow');

    const passed = testResults.filter(r => r.passed).length;
    const failed = testResults.filter(r => !r.passed).length;

    log(`Total: ${testResults.length}`, 'yellow');
    log(`Passed: ${passed}`, 'green');
    log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');

    if (failed > 0) {
        log('\nFailed Tests:', 'red');
        testResults.filter(r => !r.passed).forEach(r => {
            log(`  - ${r.name}: ${r.details}`, 'red');
        });
    }

    process.exit(failed > 0 ? 1 : 0);
}

runAll().catch(error => {
    log(`Fatal error: ${error.message}`, 'red');
    process.exit(1);
});
