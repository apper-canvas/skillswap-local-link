import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ReviewItem = ({ rating, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white rounded-lg border border-surface-200"
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <ApperIcon
                            key={i}
                            name="Star"
                            size={14}
                            className={i < rating.rating ? 'text-secondary' : 'text-gray-300'}
                        />
                    ))}
                </div>
                <span className="text-xs text-gray-500">Anonymous</span>
            </div>
            {rating.comment && (
                <p className="text-sm text-gray-600 break-words">{rating.comment}</p>
            )}
        </motion.div>
    );
};

export default ReviewItem;