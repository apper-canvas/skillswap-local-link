import React from 'react';
import { motion } from 'framer-motion';

const ChatMessage = ({ message, isOwn, index, formatTime }) => {
    return (
        <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl break-words ${
                isOwn
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-surface-200 text-gray-900'
            }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${isOwn ? 'text-primary-200' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                </p>
            </div>
        </motion.div>
    );
};

export default ChatMessage;