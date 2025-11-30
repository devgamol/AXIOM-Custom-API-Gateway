import React, { useState } from 'react';
import { Search, User, ChevronDown, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";

const Topbar = ({ onMenuClick }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();
    const { user, logout } = useAuth();   // ✅ use real auth state

    return (
        <div className="h-16 glass-strong border-b border-slate-100/50 dark:border-white/5 
                        flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">

            {/* Mobile Menu */}
            <button
                onClick={onMenuClick}
                className="md:hidden p-2 mr-4 hover:bg-slate-100 dark:hover:bg-white/10 
                           rounded-lg text-gray-300 transition-colors"
            >
                <Menu size={24} />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-xl hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        className="w-full pl-11 pr-4 py-2 glass rounded-lg text-white placeholder-gray-400 
                                   border border-white/5 focus:border-blue-400 focus:outline-none 
                                   focus:ring-2 focus:ring-blue-400/20 transition-all"
                        placeholder="Search..."
                    />
                </div>
            </div>

            {/* Profile Section */}
            <div className="relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-3 p-2 hover:bg-slate-100 
                               dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 
                                    flex items-center justify-center">
                        <User size={18} className="text-white" />
                    </div>
                    <div className="text-left hidden md:block">
                        <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-400">{user?.email || 'user@example.com'}</p>
                    </div>
                    <ChevronDown size={16} className="text-gray-300" />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-black 
                                       rounded-lg border border-white/5 shadow-xl z-50 overflow-hidden"
                        >
                            {/* SETTINGS */}
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate('/dashboard/settings');
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 
                                           dark:text-gray-300 hover:bg-slate-100 
                                           dark:hover:bg-white/10 transition-colors"
                            >
                                Settings
                            </button>

                            <div className="border-t border-white/5" />

                            {/* LOGOUT */}
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    logout();  // ⭐ REAL logout
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-red-400 
                                           hover:bg-red-500/10 transition-colors"
                            >
                                Logout
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Topbar;
