import React from 'react';
import { useApiKeys } from '../../hooks/useApiKeys';
import { useApi } from '../../context/ApiContext';

const ApiSelector = () => {
    const { apiKeys, isLoading } = useApiKeys();
    const { selectedApi, setSelectedApi } = useApi();

    if (isLoading) {
        return <div className="text-gray-400 text-sm">Loading APIs...</div>;
    }

    if (!apiKeys || apiKeys.length === 0) {
        return (
            <div className="text-gray-400 text-sm">
                No API keys. Create one to get started.
            </div>
        );
    }

    return (
        <div className="mb-6">
            <label className="block text-gray-400 text-sm font-medium mb-2">
                Select API
            </label>

            <select
                value={selectedApi?.key || ''}
                onChange={(e) => {
                    const found = apiKeys.find(api => api.key === e.target.value);
                    setSelectedApi(found || null);
                }}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-electric-cyan focus:border-transparent"
            >
                <option value="">Select an API...</option>

                {apiKeys.map((apiKey) => (
                    <option key={apiKey.key} value={apiKey.key}>
                        {apiKey.apiName || apiKey.name}
                        {apiKey.baseUrl ? ` (${apiKey.baseUrl})` : ''}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ApiSelector;
