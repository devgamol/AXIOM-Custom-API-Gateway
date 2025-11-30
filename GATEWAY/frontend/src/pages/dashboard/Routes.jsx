import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../lib/axios';
import { useRoutes } from '../../hooks/useRoutes';

const RoutesPage = () => {
    const { data: routesData, isLoading: routesLoading } = useQuery({
        queryKey: ['all-routes'],
        queryFn: async () => {
            const response = await apiClient.get('/routes');
            return response.data.data;
        },
        staleTime: 30000
    });

    const { data: servicesData } = useQuery({
        queryKey: ['all-services'],
        queryFn: async () => {
            const response = await apiClient.get('/services');
            return response.data.data;
        },
        staleTime: 30000
    });

    const { createRoute, deleteRoute } = useRoutes();

    const [isModalOpen, setIsModalOpen] = useState(false);

    // 🔥 UPDATED: backend expects path + serviceId
    const [formData, setFormData] = useState({
        apiKey: '',
        path: '',
        method: 'GET',
        serviceId: '',
        destinationPath: '',
        rateLimitPerMinute: 60
    });

    const handleCreate = (e) => {
        e.preventDefault();

        if (!formData.apiKey) {
            alert('Please provide an API key');
            return;
        }

        createRoute(formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setFormData({
                    apiKey: '',
                    path: '',
                    method: 'GET',
                    serviceId: '',
                    destinationPath: '',
                    rateLimitPerMinute: 60
                });
            }
        });
    };

    if (routesLoading) {
        return <div className="p-6 text-white">Loading routes...</div>;
    }

    const apiRoutes = routesData || [];
    const apiServices = servicesData || [];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Route Management ({apiRoutes.length})</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    + Add Route
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Method</th>
                            <th className="px-6 py-3">Path</th>
                            <th className="px-6 py-3">Target Service</th>
                            <th className="px-6 py-3">Rate Limit</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {apiRoutes.map((route) => (
                            <tr key={route._id} className="hover:bg-gray-750">
                                <td className="px-6 py-4">
                                    <span className="font-bold">{route.method}</span>
                                </td>

                                {/* 🔥 UPDATED: backend returns route.path */}
                                <td className="px-6 py-4 font-mono text-sm">{route.path}</td>

                                <td className="px-6 py-4 text-gray-400">{route.service?.name || 'Unknown'}</td>
                                <td className="px-6 py-4">{route.rateLimitPerMinute} req/min</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => deleteRoute(route._id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ADD ROUTE MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999999] pointer-events-auto">
                    <div className="bg-gray-800 p-6 rounded-lg w-96 relative z-[1000000] pointer-events-auto">
                        <h2 className="text-xl font-bold text-white mb-4">Add Route</h2>
                        <form onSubmit={handleCreate} className="space-y-4">

                            {/* API KEY */}
                            <input
                                placeholder="API Key"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.apiKey}
                                onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                                required
                            />

                            {/* METHOD */}
                            <select
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.method}
                                onChange={e => setFormData({ ...formData, method: e.target.value })}
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                            </select>

                            {/* 🔥 UPDATED PATH FIELD */}
                            <input
                                placeholder="/comments"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.path}
                                onChange={e => setFormData({ ...formData, path: e.target.value })}
                                required
                            />

                            {/* 🔥 UPDATED SERVICE DROPDOWN */}
                            <select
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.serviceId}
                                onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
                                required
                            >
                                <option value="">Select Service</option>
                                {apiServices.map(s => (
                                    <option key={s._id} value={s._id}>{s.name}</option>
                                ))}
                            </select>

                            {/* DESTINATION PATH */}
                            <input
                                placeholder="Destination Path (optional)"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.destinationPath}
                                onChange={e => setFormData({ ...formData, destinationPath: e.target.value })}
                            />

                            {/* RATE LIMIT */}
                            <input
                                type="number"
                                placeholder="Rate Limit (req/min)"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.rateLimitPerMinute}
                                onChange={e => setFormData({ ...formData, rateLimitPerMinute: parseInt(e.target.value) })}
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Create
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoutesPage;