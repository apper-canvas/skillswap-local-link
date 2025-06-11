import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ConversationPreview = ({ conversation, isSelected, onClick, index, formatTime }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={onClick}
            className={`p-4 cursor-pointer hover:bg-surface-50 transition-colors ${
                isSelected ? 'bg-primary/5 border-r-2 border-primary' : ''
            }`}
        >
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <ApperIcon name="User" size={20} className="text-white" />
                    </div>
                    {conversation.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">{conversation.unread}</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">
                            {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                            {formatTime(conversation.timestamp)}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default ConversationPreview;