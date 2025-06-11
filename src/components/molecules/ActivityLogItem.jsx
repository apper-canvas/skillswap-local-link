import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ActivityLogItem = ({ session, index }) => {
    return (
        <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-surface-200"
        >
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <ApperIcon name="CheckCircle" size={16} className="text-accent" />
                </div>
                <div>
                    <p className="font-medium text-gray-900 text-sm">Session Completed</p>
                    <p className="text-xs text-gray-500">{session.location}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-secondary font-medium text-sm">+{session.credits || 1}</p>
                <p className="text-xs text-gray-500">credits</p>
            </div>
        </motion.div>
    );
};

export default ActivityLogItem;