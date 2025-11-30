import React, { useState } from 'react';
import { useApi } from '../../context/ApiContext';
import { useApiRoutes } from '../../hooks/useApiData';
import { useRateLimits } from '../../hooks/useRateLimits';
import ApiSelector from '../../components/dashboard/ApiSelector';

const RateLimitsPage = () => {
    const { selectedApi } = useApi();

    // Fetch routes for the selected API (fixed)
    const { routes: apiRoutes, isLoading: isLoadingRoutes } =
        useApiRoutes(selectedApi?.key);

    const { checkRateLimit, checkResult, isChecking } = useRateLimits();
    const [selectedRoute, setSelectedRoute] = useState('');

    const handleCheck = () => {
        if (!selectedRoute || !selectedApi) return;

        const route = apiRoutes.find(r => r._id === selectedRoute);

        if (route) {
            checkRateLimit({
                apiKey: selectedApi.key, // FIXED
                routeId: route._id,
                limit: route.rateLimitPerMinute
            });
        }
    };

    if (!selectedApi) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white mb-6">Rate Limit Testing</h1>
                <ApiSelector />
                <div className="glass-strong p-8 rounded-xl border border-slate-100/50 dark:border-white/5 text-center">
                    <p className="text-gray-400 text-lg">Please select an API to test rate limits</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Rate Limit Testing</h1>

            <ApiSelector />

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-2xl">
                <h2 className="text-lg font-bold text-white mb-4">Check Limit Status</h2>

                <div className="space-y-4">

                    {/* Select Route Dropdown */}
                    <div>
                        <label className="block text-gray-400 mb-1">Select Route</label>
                        <select
                            className="w-full bg-gray-700 text-white p-2 rounded"
                            value={selectedRoute}
                            onChange={e => setSelectedRoute(e.target.value)}
                            disabled={isLoadingRoutes}
                        >
                            <option value="">Select Route</option>

                            {/* Correct label: METHOD + PATH PATTERN */}
                            {apiRoutes.map(r => (
                                <option key={r._id} value={r._id}>
                                    {r.method} {r.pathPattern || r.path}

                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Check Button */}
                    <button
                        onClick={handleCheck}
                        disabled={isChecking || !selectedApi || !selectedRoute}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium disabled:opacity-50"
                    >
                        {isChecking ? 'Checking...' : 'Check Status'}
                    </button>
                </div>

                {/* Result Box */}
                {checkResult && (
                    <div
                        className={`mt-6 p-4 rounded border ${
                            checkResult.allowed
                                ? 'bg-green-900/20 border-green-500/50'
                                : 'bg-red-900/20 border-red-500/50'
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className={`w-3 h-3 rounded-full ${
                                    checkResult.allowed ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            ></div>
                            <span
                                className={`font-bold ${
                                    checkResult.allowed ? 'text-green-400' : 'text-red-400'
                                }`}
                            >
                                {checkResult.allowed
                                    ? 'Request Allowed'
                                    : 'Rate Limit Exceeded'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <p className="text-gray-400 text-xs uppercase">Remaining</p>
                                <p className="text-white font-mono text-xl">
                                    {checkResult.remaining}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs uppercase">Resets At</p>
                                <p className="text-white font-mono text-sm">
                                    {new Date(checkResult.resetAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default RateLimitsPage;
