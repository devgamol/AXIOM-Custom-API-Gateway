import React from 'react';

const Loader = ({ type = 'spinner' }) => {
    if (type === 'spinner') {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="w-12 h-12 border-4 border-electric-blue/30 border-t-electric-cyan rounded-full animate-spin" />
            </div>
        );
    }

    if (type === 'shimmer') {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass rounded-lg p-4 shimmer h-20" />
                ))}
            </div>
        );
    }

    if (type === 'table') {
        return (
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="glass rounded-lg shimmer h-16" />
                ))}
            </div>
        );
    }

    return null;
};

export default Loader;
