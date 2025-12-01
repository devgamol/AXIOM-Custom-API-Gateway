import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../lib/axios';
import { useRoutes } from '../../hooks/useRoutes';
import { useApi } from '../../context/ApiContext';

const RoutesPage = () => {
    const { selectedApi } = useApi();
    const apiKey = selectedApi?.key;

    const {
        createRoute,
        deleteRoute
    } = useRoutes();

    // -----------------------------
    // FETCH ROUTES (FILTER BY apiKey)
    // -----------------------------
    const {
        data: routesData,
        isLoading: routesLoading,
        refetch: refetchRoutes
    } = useQuery({
        queryKey: ['all-routes', apiKey],
        queryFn: async () => {
            const res = await apiClient.get('/routes', {
                params: { apiKey }   // ⭐ IMPORTANT FILTER
            });
            return res.data?.data || [];
        },
        enabled: !!apiKey,
        staleTime: 0,
    });

    // -----------------------------
    // FETCH SERVICES (FILTER BY API KEY AUTOMATICALLY)
    // -----------------------------
    const {
        data: servicesData,
        isLoading: servicesLoading,
    } = useQuery({
        queryKey: ['all-services', apiKey],
        queryFn: async () => {
            const res = await apiClient.get('/services', {
                params: { apiKey }   // ⭐ IMPORTANT FILTER
            });
            return res.data?.data || [];
        },
        enabled: !!apiKey,
        staleTime: 0,
    });

    const apiRoutes = routesData || [];
    const apiServices = servicesData || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        apiKey: apiKey,
        path: '',
        method: 'GET',
        serviceId: '',
        destinationPath: '',
        rateLimitPerMinute: 60
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createRoute(formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setFormData({
                    apiKey,
                    path: '',
                    method: 'GET',
                    serviceId: '',
                    destinationPath: '',
                    rateLimitPerMinute: 60
                });
                refetchRoutes();
            }
        });
    };

    const handleDelete = (id) => {
        deleteRoute(id, {
            onSuccess: () => refetchRoutes()
        });
    };

    if (!selectedApi) {
        return (
            <div className="p-6 text-gray-300">
                Please select an API key first.
            </div>
        );
    }

    if (routesLoading || servicesLoading) {
        return <div className="p-6 text-white">Loading routes...</div>;
    }

    return (
        <div className="p-6">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">
                    Route Management ({apiRoutes.length})
                </h1>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    + Add Route
                </button>
            </div>

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
                            <tr key={route._id}>
                                <td className="px-6 py-4 font-bold">{route.method}</td>

                                <td className="px-6 py-4 font-mono text-sm">
                                    {route.pathPattern}
                                </td>

                                <td className="px-6 py-4 text-green-300">
                                    {route.service?.name || "Unknown"}
                                </td>

                                <td className="px-6 py-4">
                                    {route.rateLimitPerMinute} req/min
                                </td>

                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDelete(route._id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {apiRoutes.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-gray-500">
                                    No routes found for this API key.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999999]">
                    <div className="bg-gray-800 p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold text-white mb-4">Add Route</h2>

                        <form onSubmit={handleCreate} className="space-y-4">

                            <input
                                placeholder="Route Path"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.path}
                                onChange={(e) =>
                                    setFormData({ ...formData, path: e.target.value })
                                }
                                required
                            />

                            <select
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.method}
                                onChange={(e) =>
                                    setFormData({ ...formData, method: e.target.value })
                                }
                            >
                                <option>GET</option>
                                <option>POST</option>
                                <option>PUT</option>
                                <option>DELETE</option>
                            </select>

                            <select
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.serviceId}
                                onChange={(e) =>
                                    setFormData({ ...formData, serviceId: e.target.value })
                                }
                                required
                            >
                                <option value="">Select Service</option>
                                {apiServices.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                placeholder="Destination Path (optional)"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.destinationPath}
                                onChange={(e) =>
                                    setFormData({ ...formData, destinationPath: e.target.value })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Rate Limit (req/min)"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.rateLimitPerMinute}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        rateLimitPerMinute: parseInt(e.target.value)
                                    })
                                }
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
