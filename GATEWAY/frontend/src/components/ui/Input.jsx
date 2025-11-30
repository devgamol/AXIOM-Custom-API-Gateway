import React from 'react';

const Input = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    className = '',
    error,
    icon: Icon,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon size={20} />
                    </div>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`
            w-full px-4 py-3 ${Icon ? 'pl-11' : ''}
            glass rounded-lg
            text-slate-900 dark:text-white placeholder-gray-400
            border border-slate-200 dark:border-white/10
            focus:border-blue-500 dark:focus:border-electric-cyan/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-electric-cyan/20
            transition-all duration-300
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Input;
