import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../lib/axios';
import { useServices } from '../../hooks/useServices';
import { formatLatency } from '../../utils/formatters';

const ServicesPage = () => {
    // Fetch ALL services without filtering by API
    const { data: servicesData, isLoading } = useQuery({
        queryKey: ['all-services'],
        queryFn: async () => {
            const response = await apiClient.get('/services');
            return response.data.data;
        },
        staleTime: 30000
    });

    const { createService, deleteService, isCreating } = useServices();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        apiKey: '',
        name: '',
        baseUrl: '',
        healthPath: '/',
        description: ''
    });

    const handleCreate = (e) => {
        e.preventDefault();
        if (!formData.apiKey) {
            alert('Please provide an API key');
            return;
        }

        createService(formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setFormData({ apiKey: '', name: '', baseUrl: '', healthPath: '/', description: '' });
            }
        });
    };

    if (isLoading) {
        return <div className="p-6 text-white">Loading services...</div>;
    }

    const apiServices = servicesData || [];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Backend Services ({apiServices.length})</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    + Add Service
                </button>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 overflow-x-auto">
                <table className="w-full text-left text-gray-300 min-w-[800px]">
                    <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3 w-1/5">Name</th>
                            <th className="px-6 py-3 w-1/4">Base URL</th>
                            <th className="px-6 py-3 w-24">Status</th>
                            <th className="px-6 py-3 w-24">Latency</th>
                            <th className="px-6 py-3 w-1/6">Last Checked</th>
                            <th className="px-6 py-3 w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {apiServices.map((service) => (
                            <tr key={service._id} className="hover:bg-gray-750">
                                <td className="px-6 py-4 font-medium text-white truncate max-w-[200px]" title={service.name}>
                                    {service.name}
                                </td>
                                <td className="px-6 py-4 text-blue-400 truncate max-w-[250px]" title={service.baseUrl}>
                                    {service.baseUrl}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${service.status === 'UP' ? 'bg-green-900 text-green-300' :
                                        service.status === 'DOWN' ? 'bg-red-900 text-red-300' :
                                            'bg-gray-700 text-gray-400'
                                        }`}>
                                        {service.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatLatency(service.latency)}</td>
                                <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                                    {service.lastChecked
                                        ? new Date(service.lastChecked).toLocaleString()
                                        : 'Never'
                                    }
                                </td>
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

            {/* Add Service Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold text-white mb-4">Add Service</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                placeholder="API Key"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.apiKey}
                                onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Service Name"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Base URL (e.g., https://api.example.com)"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.baseUrl}
                                onChange={e => setFormData({ ...formData, baseUrl: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Health Path (default: /)"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.healthPath}
                                onChange={e => setFormData({ ...formData, healthPath: e.target.value })}
                            />
                            <textarea
                                placeholder="Description (optional)"
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
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
