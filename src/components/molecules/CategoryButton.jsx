import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const CategoryButton = ({ category, isSelected, onClick }) => {
    return (
        <Button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isSelected
                    ? 'bg-primary text-white'
                    : 'bg-surface text-gray-700 hover:bg-surface-200'
            }`}
        >
            <ApperIcon name={category.icon} size={16} />
            <span>{category.name}</span>
        </Button>
    );
};

export default CategoryButton;