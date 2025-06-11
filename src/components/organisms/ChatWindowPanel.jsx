import React from 'react';
import ChatMessage from '@/components/molecules/ChatMessage';
import MessageInputForm from '@/components/molecules/MessageInputForm';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';

const ChatWindowPanel = ({ selectedConversation, messages, newMessage, onNewMessageChange, onSendMessage, formatTime, isVisible }) => {
    return (
        <div className={`${isVisible ? 'block' : 'hidden lg:block'} flex-1 flex flex-col min-w-0`}>
            {selectedConversation ? (
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                isOwn={message.senderId === 'current-user'}
                                index={index}
                                formatTime={formatTime}
                            />
                        ))}
                    </div>

                    <MessageInputForm
                        newMessage={newMessage}
                        onNewMessageChange={onNewMessageChange}
                        onSendMessage={onSendMessage}
                    />
                </>
            ) : (
                <EmptyState
                    iconName="MessageCircle"
                    title="Select a conversation"
                    message="Choose a conversation to start chatting"
                >
                    <ApperIcon name="MessageCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                </EmptyState>
            )}
        </div>
    );
};

export default ChatWindowPanel;