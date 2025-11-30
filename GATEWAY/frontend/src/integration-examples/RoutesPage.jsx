import React, { useState } from 'react';
import { useRoutes } from '../hooks/useRoutes';
import { useServices } from '../hooks/useServices';

const RoutesPage = () => {
    const { routes, isLoading, createRoute, deleteRoute } = useRoutes();
    const { services } = useServices();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        path: '',
        method: 'GET',
        serviceId: '',
        rateLimit: 60
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createRoute(formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setFormData({ path: '', method: 'GET', serviceId: '', rateLimit: 60 });
            }
        });
    };

    if (isLoading) return <div className="text-white">Loading routes...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Route Management</h1>
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
                        {routes.map((route) => (
                            <tr key={route._id} className="hover:bg-gray-750">
                                <td className="px-6 py-4">
                                    <span className={`font-bold ${route.method === 'GET' ? 'text-green-400' :
                                            route.method === 'POST' ? 'text-blue-400' :
                                                route.method === 'DELETE' ? 'text-red-400' : 'text-yellow-400'
                                        }`}>
                                        {route.method}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-sm">{route.path}</td>
                                <td className="px-6 py-4 text-gray-400">
                                    {route.serviceId?.name || 'Unknown Service'}
                                </td>
                                <td className="px-6 py-4">
                                    {route.rateLimit} req/min
                                </td>
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

            {/* Add Route Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold text-white mb-4">Add Route</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
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

                            <input
                                placeholder="/api/path"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.path}
                                onChange={e => setFormData({ ...formData, path: e.target.value })}
                            />

                            <select
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.serviceId}
                                onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
                                required
                            >
                                <option value="">Select Service</option>
                                {services.map(s => (
                                    <option key={s._id} value={s._id}>{s.name}</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder="Rate Limit (req/min)"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.rateLimit}
                                onChange={e => setFormData({ ...formData, rateLimit: parseInt(e.target.value) })}
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
