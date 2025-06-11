import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ActionIconButton = ({ iconName, size = 20, onClick, className = '', ...rest }) => {
    return (
        <Button
            onClick={onClick}
            className={`p-2 text-gray-400 hover:text-gray-600 ${className}`}
            {...rest}
        >
            <ApperIcon name={iconName} size={size} />
        </Button>
    );
};

export default ActionIconButton;