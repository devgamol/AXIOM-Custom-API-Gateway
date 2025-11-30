import React from 'react';
import { useLogs } from '../hooks/useLogs';
import { formatStatus, formatLatency, formatDate } from '../utils/formatters';

const LogsPage = () => {
    const {
        logs,
        pagination,
        isLoading,
        filters,
        updateFilter,
        setPage
    } = useLogs();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Request Logs</h1>

            {/* Filters */}
            <div className="flex gap-4 mb-6 flex-wrap">
                <input
                    placeholder="Filter by API Key"
                    className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700"
                    value={filters.apiKey}
                    onChange={e => updateFilter('apiKey', e.target.value)}
                />
                <select
                    className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700"
                    value={filters.status}
                    onChange={e => updateFilter('status', e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="200">200 OK</option>
                    <option value="201">201 Created</option>
                    <option value="400">400 Bad Request</option>
                    <option value="401">401 Unauthorized</option>
                    <option value="429">429 Too Many Requests</option>
                    <option value="500">500 Server Error</option>
                </select>
                {/* Add date pickers if needed */}
            </div>

            {/* Logs Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-400">Loading logs...</div>
                ) : (
                    <table className="w-full text-left text-gray-300 text-sm">
                        <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Time</th>
                                <th className="px-6 py-3">Method</th>
                                <th className="px-6 py-3">Path</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Latency</th>
                                <th className="px-6 py-3">API Key</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {logs.map((log) => {
                                const statusStyle = formatStatus(log.statusCode);
                                return (
                                    <tr key={log._id} className="hover:bg-gray-750 font-mono">
                                        <td className="px-6 py-4 text-gray-400">
                                            {formatDate(log.timestamp)}
                                        </td>
                                        <td className="px-6 py-4 font-bold">{log.method}</td>
                                        <td className="px-6 py-4">{log.endpoint}</td>
                                        <td className={`px-6 py-4 ${statusStyle.color}`}>
                                            {log.statusCode}
                                        </td>
                                        <td className="px-6 py-4">{formatLatency(log.latency)}</td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {log.apiKey?.substring(0, 8)}...
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
                <span>
                    Showing {logs.length} of {pagination.total} logs
                </span>
                <div className="flex gap-2">
                    <button
                        disabled={pagination.page === 1}
                        onClick={() => setPage(pagination.page - 1)}
                        className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1">Page {pagination.page}</span>
                    <button
                        disabled={pagination.page >= pagination.pages}
                        onClick={() => setPage(pagination.page + 1)}
                        className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogsPage;
