import React, { useState } from 'react';
import { useServices } from '../hooks/useServices';
import { formatLatency } from '../utils/formatters';

const ServicesPage = () => {
    const {
        services,
        isLoadingServices,
        createService,
        deleteService,
        isCreating
    } = useServices();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        baseUrl: '',
        description: ''
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createService(formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setFormData({ name: '', baseUrl: '', description: '' });
            }
        });
    };

    if (isLoadingServices) return <div className="text-white">Loading services...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Backend Services</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    + Add Service
                </button>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Base URL</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Latency</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {services.map((service) => (
                            <tr key={service._id} className="hover:bg-gray-750">
                                <td className="px-6 py-4 font-medium text-white">{service.name}</td>
                                <td className="px-6 py-4 text-blue-400">{service.baseUrl}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${service.status === 'UP' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                                        }`}>
                                        {service.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{formatLatency(service.avgLatency)}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => deleteService(service._id)}
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

            {/* Simple Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold text-white mb-4">Add Service</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                placeholder="Service Name"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                placeholder="Base URL"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.baseUrl}
                                onChange={e => setFormData({ ...formData, baseUrl: e.target.value })}
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
                                    disabled={isCreating}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    {isCreating ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesPage;
