import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../lib/axios';

const Settings = () => {
    const { logout, user } = useAuth();

    const [isEditing, setIsEditing] = React.useState(false);

    const [formData, setFormData] = React.useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    const [passwordData, setPasswordData] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [message, setMessage] = React.useState({ type: '', text: '' });

    // ---------------------------
    // API CALLS
    // ---------------------------

    const updateProfile = async (data) => {
        return apiClient.put("/auth/update", data);
    };

    const changePassword = async (data) => {
        return apiClient.put("/auth/change-password", data);
    };

    // ---------------------------
    // UPDATE PROFILE HANDLER
    // ---------------------------
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await updateProfile(formData);

            if (res.data?.success) {
                const updatedUser = res.data.data;

                localStorage.setItem("user", JSON.stringify(updatedUser));

                setMessage({ type: 'success', text: 'Profile updated successfully' });
                setIsEditing(false);
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile'
            });
        }
    };

    // ---------------------------
    // PASSWORD CHANGE HANDLER
    // ---------------------------
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        try {
            const res = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            if (res.data?.success) {
                setMessage({ type: 'success', text: 'Password changed successfully' });

                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to change password'
            });
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

            {message.text && (
                <div
                    className={`mb-6 p-4 rounded ${
                        message.type === 'success'
                            ? 'bg-green-900/50 text-green-200'
                            : 'bg-red-900/50 text-red-200'
                    }`}
                >
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* PROFILE SECTION */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white">Profile Information</h2>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                            >
                                Save Changes
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Name</label>
                                <div className="text-white font-medium">{user?.name}</div>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Email</label>
                                <div className="text-white font-medium">{user?.email}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* PASSWORD SECTION */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h2 className="text-lg font-bold text-white mb-6">Change Password</h2>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Current Password</label>
                            <input
                                type="password"
                                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                                value={passwordData.currentPassword}
                                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-1">New Password</label>
                            <input
                                type="password"
                                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                                value={passwordData.newPassword}
                                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                                value={passwordData.confirmPassword}
                                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full"
                        >
                            Update Password
                        </button>
                    </form>
                </div>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-6">
                <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Settings;
