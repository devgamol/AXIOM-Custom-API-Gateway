import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    ...props
}) => {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2';

    const variants = {
        primary: 'bg-gradient-to-r from-electric-blue to-blue-600 hover:from-blue-600 hover:to-electric-blue text-white neon-glow hover:neon-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed',
        secondary: 'glass hover:glass-strong text-white border border-white/20 hover:border-electric-cyan/50 disabled:opacity-50',
        ghost: 'text-white hover:bg-white/10 disabled:opacity-50',
        danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-600 text-white disabled:opacity-50',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
