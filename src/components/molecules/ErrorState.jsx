import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ message, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-4 text-center">{message}</p>
            {onRetry && (
                <Button
                    onClick={onRetry}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
                >
                    Try Again
                </Button>
            )}
        </div>
    );
};

export default ErrorState;