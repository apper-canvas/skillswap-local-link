import React from 'react';
import Button from '@/components/atoms/Button';

const TabButton = ({ label, isActive, onClick, className = '' }) => {
    return (
        <Button
            type="button"
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                isActive
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-primary'
            } ${className}`}
        >
            {label}
        </Button>
    );
};

export default TabButton;