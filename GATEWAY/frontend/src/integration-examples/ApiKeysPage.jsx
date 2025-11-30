import React, { useState } from 'react';
import { useApiKeys } from '../hooks/useApiKeys';
import { maskApiKey } from '../utils/formatters';
import { copyToClipboard } from '../utils/proxyUrl';

const ApiKeysPage = () => {
    const {
        apiKeys,
        isLoading,
        createApiKey,
        deleteApiKey,
        rotateApiKey
    } = useApiKeys();

    const [newKeyName, setNewKeyName] = useState('');

    const handleCreate = (e) => {
        e.preventDefault();
        if (!newKeyName) return;
        // Assuming userId is handled in the hook or context
        // In a real app, you might pass userId explicitly if needed
        // But our hook handles it via getCurrentUser() usually, 
        // or we pass it from auth context. 
        // For this example, let's assume the hook handles the user ID internally 
        // or we pass a dummy one if the backend requires it in body (which it does).
        // The hook useApiKeys fetches keys for current user.
        // The createApiKey API call needs userId. 
        // Let's assume we get it from auth context in a real app.
        const user = JSON.parse(localStorage.getItem('user'));
        createApiKey({ userId: user.id, name: newKeyName }, {
            onSuccess: () => setNewKeyName('')
        });
    };

    if (isLoading) return <div className="text-white">Loading API keys...</div>;

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-4">API Keys</h1>
                <form onSubmit={handleCreate} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="New Key Name (e.g. Production App)"
                        className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-blue-500 outline-none w-96"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
                    >
                        Generate Key
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {apiKeys.map((key) => (
                    <div key={key._id} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">{key.name}</h3>
                                <p className="text-gray-400 text-sm">Created on {new Date(key.createdAt).toLocaleDateString()}</p>
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
