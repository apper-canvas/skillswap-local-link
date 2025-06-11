import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, className = '', rows, ...rest }) => {
    const inputClasses = `w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${className}`;

    if (type === 'textarea') {
        return (
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClasses}
                rows={rows}
                {...rest}
            />
        );
    }

    if (type === 'select') {
        return (
            <select
                value={value}
                onChange={onChange}
                className={inputClasses}
                {...rest}
            >
                {/* Options are expected to be passed as children */}
                {rest.children}
            </select>
        );
    }

    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClasses}
            {...rest}
        />
    );
};

export default Input;