import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, Zap, Lock } from 'lucide-react';
import Button from '../components/ui/Button';

const Landing = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Activity,
            title: 'Real-time Monitoring',
            description: 'Track API metrics and performance in real-time',
        },
        {
            icon: Shield,
            title: 'Rate Limiting',
            description: 'Protect your APIs with intelligent rate limiting',
        },
        {
            icon: Zap,
            title: 'Smart Routing',
            description: 'Efficient request routing and load balancing',
        },
        {
            icon: Lock,
            title: 'Security First',
            description: 'Enterprise-grade security and authentication',
        },
    ];

    return (
        <div className="min-h-screen animated-gradient overflow-hidden">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-5xl mx-auto"
                >
                    {/* Logo/Brand */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <h1 className="text-6xl md:text-7xl font-bold mb-4">
                            <span className="gradient-text">API Gateway</span>
                        </h1>
                        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-electric-blue via-electric-cyan to-teal-glow rounded-full" />
                    </motion.div>

                    {/* Hero Text */}
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6 text-shadow"
                    >
                        Monitor. Secure. Scale Your APIs Effortlessly.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
                    >
                        Smart API Gateway Management with automatic metrics & rate limiting.
                        Streamline your API infrastructure with real-time insights and powerful controls.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Button
                            size="lg"
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto min-w-[200px]"
                        >
                            Login
                        </Button>
                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={() => navigate('/register')}
                            className="w-full sm:w-auto min-w-[200px]"
                        >
                            Create Account
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 + index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="glass rounded-2xl p-6 text-center hover:glass-strong transition-all duration-300 hover:neon-glow"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-electric-blue to-electric-cyan mb-4">
                                <feature.icon size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Floating Orbs Background Effect */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -100, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, -100, 0],
                            y: [0, 100, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-cyan/10 rounded-full blur-3xl"
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 mt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © 2025 API Gateway. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-400 hover:text-electric-cyan transition-colors text-sm">
                                Terms
                            </a>
                            <a href="#" className="text-gray-400 hover:text-electric-cyan transition-colors text-sm">
                                Privacy
                            </a>
                            <a href="#" className="text-gray-400 hover:text-electric-cyan transition-colors text-sm">
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
