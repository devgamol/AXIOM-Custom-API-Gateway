const axios = require('axios');
const Service = require('../models/Service');
const Logger = require('../shared/utils/logger');

/**
 * Active Health Checker Service
 * Runs every 10 seconds to check health of all registered services
 */

const HEALTH_CHECK_INTERVAL = 10000; // 10 seconds
const HEALTH_CHECK_TIMEOUT = 5000; // 5 seconds

let healthCheckTimer = null;

/**
 * Check health of a single service
 */
async function checkServiceHealth(service) {
    const startTime = Date.now();
    let status = 'DOWN';
    let latency = 0;

    try {
        const healthUrl = service.baseUrl + (service.healthPath || '/');

        const response = await axios.get(healthUrl, {
            timeout: HEALTH_CHECK_TIMEOUT,
            validateStatus: () => true // Accept any status code
        });

        latency = Date.now() - startTime;

        // Consider 2xx and 3xx as healthy
        if (response.status >= 200 && response.status < 400) {
            status = 'UP';
        } else {
            status = 'DOWN';
        }

        Logger.info(`[HealthCheck] ${service.name}: ${status} (${latency}ms)`);

    } catch (error) {
        status = 'DOWN';
        latency = Date.now() - startTime;
        Logger.warn(`[HealthCheck] ${service.name}: DOWN - ${error.message}`);
    }

    // Update service in database
    try {
        const updatedService = await Service.findByIdAndUpdate(service._id, {
            status,
            latency,
            lastChecked: new Date()
        }, { new: true });

        // Sync with ApiMetric
        if (updatedService && updatedService.apiKey) {
            const ApiMetric = require('../models/ApiMetric');

            // We need to update the specific service entry in the serviceHealth array
            // Or push if not exists.

            await ApiMetric.findOneAndUpdate(
                { apiKey: updatedService.apiKey },
                {
                    $pull: { serviceHealth: { serviceId: updatedService._id } }
                }
            );

            await ApiMetric.findOneAndUpdate(
                { apiKey: updatedService.apiKey },
                {
                    $push: {
                        serviceHealth: {
                            serviceId: updatedService._id,
                            name: updatedService.name,
                            status: updatedService.status,
                            latency: updatedService.latency,
                            lastChecked: updatedService.lastChecked
                        }
                    }
                }
            );
        }

        // Invalidate cache
        const { serviceCache } = require('../utils/cache');
        serviceCache.del(service._id.toString());

    } catch (dbError) {
        Logger.error(`[HealthCheck] Failed to update service ${service.name}:`, dbError);
    }
}

/**
 * Run health checks for all services
 */
async function runHealthChecks() {
    try {
        const services = await Service.find();

        if (services.length === 0) {
            Logger.info('[HealthCheck] No services to check');
            return;
        }

        Logger.info(`[HealthCheck] Checking ${services.length} services...`);

        // Check all services in parallel
        await Promise.all(
            services.map(service => checkServiceHealth(service))
        );

        Logger.info('[HealthCheck] Health check cycle completed');

    } catch (error) {
        Logger.error('[HealthCheck] Error during health check cycle:', error);
    }
}

/**
 * Start the health checker
 */
function startHealthChecker() {
    if (healthCheckTimer) {
        Logger.warn('[HealthCheck] Health checker already running');
        return;
    }

    Logger.info(`[HealthCheck] Starting health checker (interval: ${HEALTH_CHECK_INTERVAL}ms)`);

    // Run immediately on start
    runHealthChecks();

    // Then run on interval
    healthCheckTimer = setInterval(runHealthChecks, HEALTH_CHECK_INTERVAL);
}

/**
 * Stop the health checker
 */
function stopHealthChecker() {
    if (healthCheckTimer) {
        clearInterval(healthCheckTimer);
        healthCheckTimer = null;
        Logger.info('[HealthCheck] Health checker stopped');
    }
}

module.exports = {
    startHealthChecker,
    stopHealthChecker,
    runHealthChecks
};
