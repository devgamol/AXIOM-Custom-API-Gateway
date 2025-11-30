import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Register = () => {
    const { register, isRegistering, registerError } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        register(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-white mb-6">Register</h2>

                {registerError && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
                        {registerError.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isRegistering}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
                    >
                        {isRegistering ? 'Creating Account...' : 'Register'}
                    </button>

                    <div className="text-center text-gray-400 text-sm mt-4">
                        Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
