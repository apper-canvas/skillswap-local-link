import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ iconName, title, message, actionText, onActionClick }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12 px-4"
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
            >
                <ApperIcon name={iconName} className="w-16 h-16 text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-gray-500">{message}</p>
            {actionText && onActionClick && (
                <Button
                    onClick={onActionClick}
                    className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
                >
                    {actionText}
                </Button>
            )}
        </motion.div>
    );
};

export default EmptyState;