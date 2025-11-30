import React from 'react';
import { Copy, TrendingUp, Shield, Server, Zap } from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import { useApiStats } from '../../hooks/useApiData';
import { copyToClipboard } from '../../utils/clipboard';
import { formatLatency } from '../../utils/formatters';
import RequestsChart from '../../components/charts/RequestsChart';
import ApiSelector from '../../components/dashboard/ApiSelector';

const OverviewPage = () => {
    const { selectedApi } = useApi();
    const { stats, isLoading } = useApiStats(selectedApi?.key);


    if (!selectedApi) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold gradient-text mb-8">Dashboard Overview</h1>
                <ApiSelector />
                <div className="glass-strong p-8 rounded-xl border border-slate-100/50 dark:border-white/5 text-center">
                    <p className="text-gray-400 text-lg">Please select an API to view dashboard</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold gradient-text mb-8">Dashboard Overview</h1>
                <ApiSelector />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-cyan"></div>
                </div>
            </div>
        );
    }

    const handleCopyProxyUrl = () => {
        copyToClipboard(stats.proxyUrl, 'Proxy URL copied to clipboard!');
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold gradient-text">Dashboard Overview</h1>
            </div>

            <ApiSelector />

            {/* API Details Card */}
            {stats.apiDetails && (
                <div className="glass-strong p-6 rounded-xl border border-slate-100/50 dark:border-white/5 mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{stats.apiDetails.apiName || stats.apiDetails.name}</h2>
                            <p className="text-gray-400 mb-4">{stats.apiDetails.description || 'No description provided'}</p>
                            <div className="flex gap-4 text-sm">
                                <span className="text-gray-400">Version: <span className="text-white">{stats.apiDetails.version}</span></span>
                                {stats.apiDetails.baseUrl && (
                                    <span className="text-gray-400">Base URL: <span className="text-blue-400">{stats.apiDetails.baseUrl}</span></span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase mb-1">Proxy URL</div>
                            <code className="text-sm bg-black/30 px-3 py-1 rounded text-electric-cyan block mb-2">
                                {stats.proxyUrl}
                            </code>
                            <button
                                onClick={handleCopyProxyUrl}
                                className="text-xs text-gray-400 hover:text-white underline"
                            >
                                Copy URL
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Requests */}
                <div className="glass-strong p-6 rounded-xl border border-slate-100/50 dark:border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-blue-500/10">
                            <TrendingUp className="text-blue-400" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Total Requests</h3>
                    <p className="text-3xl font-bold text-white">{stats.totalRequests.toLocaleString()}</p>
                </div>

                {/* Blocked Requests */}
                <div className="glass-strong p-6 rounded-xl border border-slate-100/50 dark:border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-red-500/10">
                            <Shield className="text-red-400" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Blocked Requests</h3>
                    <p className="text-3xl font-bold text-red-400">{stats.blockedRequests.toLocaleString()}</p>
                </div>

                {/* Active Services */}
                <div className="glass-strong p-6 rounded-xl border border-slate-100/50 dark:border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-green-500/10">
                            <Server className="text-green-400" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Active Services</h3>
                    <p className="text-3xl font-bold text-green-400">
                        {stats.activeServices} / {stats.totalServices}
                    </p>
                </div>

                {/* Average Latency (Real from Health Checker) */}
                <div className="glass-strong p-6 rounded-xl border border-slate-100/50 dark:border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-purple-500/10">
                            <Zap className="text-purple-400" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Avg Latency (Live)</h3>
                    <p className="text-3xl font-bold text-purple-400">{formatLatency(stats.avgLatency)}</p>
                </div>
            </div>

            {/* Status Breakdown */}
            <div className="glass-strong p-6 rounded-xl border border-slate-100/50 dark:border-white/5 mb-8">
                <h3 className="text-white font-bold mb-4">Status Breakdown (24h)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex justify-between items-center p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                        <span className="text-green-400 font-medium">2xx Success</span>
                        <span className="text-white font-bold text-xl">{stats.statusBreakdown['2xx'] || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                        <span className="text-yellow-400 font-medium">4xx Client Error</span>
                        <span className="text-white font-bold text-xl">{stats.statusBreakdown['4xx'] || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                        <span className="text-red-400 font-medium">5xx Server Error</span>
                        <span className="text-white font-bold text-xl">{stats.statusBreakdown['5xx'] || 0}</span>
                    </div>
                </div>
            </div>

            {/* Requests Over Time Chart */}
            {stats.timeseries && stats.timeseries.length > 0 && (
                <div className="glass-strong p-6 rounded-xl border border-slate-100/50 dark:border-white/5 mb-8">
                    <h3 className="text-white font-bold mb-4">Requests Over Time (24h)</h3>
                    <RequestsChart data={stats.timeseries} />
                </div>
            )}

            {/* Recent Activity */}
            {stats.recent && stats.recent.length > 0 && (
                <div className="glass-strong p-6 rounded-xl border border-slate-100/50 dark:border-white/5">
                    <h3 className="text-white font-bold mb-4">Recent Activity</h3>
                    <div className="space-y-2">
                        {stats.recent.slice(0, 5).map((log, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${log.statusCode >= 200 && log.statusCode < 300 ? 'bg-green-500/20 text-green-400' :
                                        log.statusCode >= 400 && log.statusCode < 500 ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>
                                        {log.statusCode}
                                    </span>
                                    <span className="text-gray-300 text-sm">{log.method} {log.endpoint}</span>
                                </div>
                                <span className="text-gray-500 text-xs">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverviewPage;
