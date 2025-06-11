import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ConversationPreview from '@/components/molecules/ConversationPreview';
import EmptyState from '@/components/molecules/EmptyState';

const ConversationListPanel = ({ conversations, selectedConversation, onSelectConversation, formatTime, isVisible }) => {
    return (
        <div className={`${isVisible ? 'block' : 'hidden lg:block'} w-full lg:w-80 flex-shrink-0 bg-white border-r border-surface-200 overflow-y-auto`}>
            {conversations.length === 0 ? (
                <EmptyState
                    iconName="MessageCircle"
                    title="No conversations yet"
                    message="Start connecting with neighbors to begin chatting"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        <ApperIcon name="MessageCircle" className="w-16 h-16 text-gray-300 mx-auto" />
                    </motion.div>
                </EmptyState>
            ) : (
                <div className="divide-y divide-surface-200">
                    {conversations.map((conversation, index) => (
                        <ConversationPreview
                            key={conversation.id}
                            conversation={conversation}
                            isSelected={selectedConversation?.id === conversation.id}
                            onClick={() => onSelectConversation(conversation)}
                            index={index}
                            formatTime={formatTime}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConversationListPanel;