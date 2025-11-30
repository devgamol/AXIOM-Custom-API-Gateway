import React, { useState } from 'react';
import { useApiKeys } from '../../hooks/useApiKeys';
import { maskApiKey } from '../../utils/formatters';
import { copyToClipboard } from '../../utils/clipboard';

const ApiKeysPage = () => {
    const {
        apiKeys,
        isLoading,
        createApiKey,
        deleteApiKey,
        rotateApiKey
    } = useApiKeys();

    const [formData, setFormData] = useState({
        name: '',
        apiName: '',
        baseUrl: '',
        description: '',
        version: '1.0.0',
        healthPath: '/health'
    });

    const handleCreate = (e) => {
        e.preventDefault();
        if (!formData.name) return;

        // Use name as apiName if not provided
        const payload = {
            ...formData,
            apiName: formData.apiName || formData.name
        };

        // Assuming userId is handled in the hook or context
        const user = JSON.parse(localStorage.getItem('user'));
        createApiKey({ userId: user?.id, ...payload }, {
            onSuccess: () => setFormData({
                name: '',
                apiName: '',
                baseUrl: '',
                description: '',
                version: '1.0.0',
                healthPath: '/health'
            })
        });
    };

    if (isLoading) return <div className="text-white">Loading API keys...</div>;

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-4">API Management</h1>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h2 className="text-lg font-bold text-white mb-4">Create New API</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <label className="block text-gray-400 text-sm mb-1">Internal Name (Required)</label>
                            <input
                                type="text"
                                placeholder="e.g. Production App"
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-gray-400 text-sm mb-1">Public API Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Payment Service"
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                value={formData.apiName}
                                onChange={(e) => setFormData({ ...formData, apiName: e.target.value })}
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-gray-400 text-sm mb-1">Base URL</label>
                            <input
                                type="text"
                                placeholder="e.g. https://api.myservice.com"
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                value={formData.baseUrl}
                                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-gray-400 text-sm mb-1">Health Path</label>
                            <input
                                type="text"
                                placeholder="e.g. /health"
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                value={formData.healthPath}
                                onChange={(e) => setFormData({ ...formData, healthPath: e.target.value })}
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-gray-400 text-sm mb-1">Version</label>
                            <input
                                type="text"
                                placeholder="e.g. 1.0.0"
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                value={formData.version}
                                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-gray-400 text-sm mb-1">Description</label>
                            <textarea
                                placeholder="API Description"
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="2"
                            />
                        </div>
                        <div className="col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
                            >
                                Generate API Key
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {apiKeys.map((key) => (
                    <div key={key._id} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">{key.apiName || key.name}</h3>
                                <p className="text-gray-400 text-sm">{key.description || 'No description'}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded whitespace-nowrap">v{key.version}</span>
                                    {key.baseUrl && <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded truncate max-w-[200px]" title={key.baseUrl}>{key.baseUrl}</span>}
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${key.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                {key.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                        </div>

                        <div className="bg-gray-900 rounded p-3 mb-4 flex justify-between items-center group">
                            <code className="text-blue-400 font-mono text-sm break-all">
                                {maskApiKey(key.key)}
                            </code>
                            <button
                                onClick={() => copyToClipboard(key.key)}
                                className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition"
                            >
                                Copy
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div>
                                <p className="text-gray-500 text-xs uppercase">Requests</p>
                                <p className="text-white font-bold">{key.totalRequests}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase">Blocked</p>
                                <p className="text-white font-bold">{key.blockedRequests}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase">Avg Latency</p>
                                <p className="text-white font-bold">{Math.round(key.averageLatency)}ms</p>
                            </div>
                        </div>

                        <div className="flex gap-3 border-t border-gray-700 pt-4">
                            <button
                                onClick={() => rotateApiKey(key._id)}
                                className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                            >
                                Rotate Key
                            </button>
                            <button
                                onClick={() => deleteApiKey(key._id)}
                                className="text-red-500 hover:text-red-400 text-sm font-medium ml-auto"
                            >
                                Revoke
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApiKeysPage;
