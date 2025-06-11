import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
    return (
        <div className={`relative ${className}`}>
            <ApperIcon
                name="Search"
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
        </div>
    );
};

export default SearchInput;