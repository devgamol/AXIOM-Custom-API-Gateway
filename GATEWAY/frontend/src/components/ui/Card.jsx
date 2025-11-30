import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
    children,
    className = '',
    hover = true,
    glow = false,
    ...props
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
            className={`
        glass-card rounded-xl p-6 
        ${hover ? 'hover:shadow-lg dark:hover:glass-strong dark:hover:shadow-glass' : ''}
        ${glow ? 'hover:shadow-blue-500/20 dark:hover:neon-glow' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
