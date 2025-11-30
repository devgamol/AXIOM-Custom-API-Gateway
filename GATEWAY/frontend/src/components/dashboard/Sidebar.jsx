import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Server,
    GitBranch,
    Key,
    Shield,
    FileText,
    Settings,
    LogOut,
    Zap,
    X,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const navItems = [
        { path: '/dashboard/overview', icon: LayoutDashboard, label: 'Overview' },
        { path: '/dashboard/services', icon: Server, label: 'Services' },
        { path: '/dashboard/routes', icon: GitBranch, label: 'Routes' },
        { path: '/dashboard/apikeys', icon: Key, label: 'API Keys' },
        { path: '/dashboard/ratelimits', icon: Shield, label: 'Rate Limits' },
        { path: '/dashboard/logs', icon: FileText, label: 'Logs' },
        { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden pointer-events-auto"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Panel */}
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className={`
                    pointer-events-auto
                    w-64 h-screen glass-strong border-r border-slate-100/50 dark:border-white/5 
                    flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Logo */}
                <div className="h-16 px-6 border-b border-slate-100/50 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center">
                            <Zap size={20} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold gradient-text">Axiom</h1>
                    </div>
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-white neon-glow border border-blue-200 dark:border-electric-cyan/30'
                                        : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-100/50 dark:border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default Sidebar;
