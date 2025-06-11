import React from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const MessageInputForm = ({ newMessage, onNewMessageChange, onSendMessage }) => {
    return (
        <div className="flex-shrink-0 border-t border-surface-200 p-4">
            <form onSubmit={onSendMessage} className="flex space-x-3">
                <Input
                    type="text"
                    value={newMessage}
                    onChange={onNewMessageChange}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-surface border border-surface-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-primary text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                >
                    <ApperIcon name="Send" size={18} />
                </Button>
            </form>
        </div>
    );
};

export default MessageInputForm;