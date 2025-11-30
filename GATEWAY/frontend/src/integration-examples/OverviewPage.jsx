import React from 'react';
import { useApiKeys } from '../hooks/useApiKeys';
import { useMetrics } from '../hooks/useMetrics';
import { formatLatency } from '../utils/formatters';

const OverviewPage = () => {
    const { apiKeys } = useApiKeys();
    // Get metrics for the first API key as an example, or aggregate all
    const firstKey = apiKeys[0]?.key;
    const { aggregated, isLoading } = useMetrics(firstKey);

    if (isLoading) return <div className="text-white">Loading metrics...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Requests Card */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Total Requests</h3>
                    <p className="text-3xl font-bold text-white mt-2">
                        {aggregated.totalRequests.toLocaleString()}
                    </p>
                </div>

                {/* Average Latency Card */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Avg Latency</h3>
                    <p className="text-3xl font-bold text-blue-400 mt-2">
                        {formatLatency(aggregated.avgLatency)}
                    </p>
                </div>

                {/* Success Rate Card */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Success Rate</h3>
                    <p className="text-3xl font-bold text-green-400 mt-2">
                        {aggregated.totalRequests > 0
                            ? `${Math.round(((aggregated.totalRequests - aggregated.blockedRequests) / aggregated.totalRequests) * 100)}%`
                            : '100%'}
                    </p>
                </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-white font-bold mb-4">Status Breakdown</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-green-400">2xx Success</span>
                        <span className="text-white">{aggregated.statusBreakdown['2xx']}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-yellow-400">4xx Client Error</span>
                        <span className="text-white">{aggregated.statusBreakdown['4xx']}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-red-400">5xx Server Error</span>
                        <span className="text-white">{aggregated.statusBreakdown['5xx']}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewPage;
