import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import ActionIconButton from '@/components/molecules/ActionIconButton';
import ConversationListPanel from '@/components/organisms/ConversationListPanel';
import ChatWindowPanel from '@/components/organisms/ChatWindowPanel';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import ErrorState from '@/components/molecules/ErrorState';
import { messageService } from '@/services';

export default function MessagesPage() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await messageService.getAll();
            const grouped = data.reduce((acc, message) => {
                const partnerId = message.senderId === 'current-user' ? message.recipientId : message.senderId;
                if (!acc[partnerId]) {
                    acc[partnerId] = {
                        id: partnerId,
                        name: `User ${partnerId.slice(-4)}`,
                        avatar: null,
                        lastMessage: message.content,
                        timestamp: message.timestamp,
                        unread: Math.floor(Math.random() * 3),
                        messages: []
                    };
                }
                acc[partnerId].messages.push(message);
                if (new Date(message.timestamp) > new Date(acc[partnerId].timestamp)) {
                    acc[partnerId].lastMessage = message.content;
                    acc[partnerId].timestamp = message.timestamp;
                }
                return acc;
            }, {});

            setConversations(Object.values(grouped).sort((a, b) =>
                new Date(b.timestamp) - new Date(a.timestamp)
            ));
        } catch (err) {
            setError(err.message || 'Failed to load messages');
            toast.error('Failed to load conversations');
        } finally {
            setLoading(false);
        }
    };

    const selectConversation = (conversation) => {
        setSelectedConversation(conversation);
        setMessages(conversation.messages.sort((a, b) =>
            new Date(a.timestamp) - new Date(b.timestamp)
        ));
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            const message = await messageService.create({
                senderId: 'current-user',
                recipientId: selectedConversation.id,
                content: newMessage.trim(),
                sessionId: null
            });

            setMessages(prev => [...prev, message]);
            setNewMessage('');

            setConversations(prev => prev.map(conv =>
                conv.id === selectedConversation.id
                    ? { ...conv, lastMessage: message.content, timestamp: message.timestamp }
                    : conv
            ));
        } catch (err) {
            toast.error('Failed to send message');
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Now';
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="h-full bg-background">
                <div className="bg-white border-b border-surface-200 px-4 py-6">
                    <LoadingSkeleton>
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                    </LoadingSkeleton>
                </div>
                <div className="p-4 space-y-4">
                    <LoadingSkeleton count={5}>
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    </LoadingSkeleton>
                </div>
            </div>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={loadConversations} />;
    }

    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden">
            <div className="bg-white border-b border-surface-200 px-4 py-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-heading text-gray-900">
                            {selectedConversation ? selectedConversation.name : 'Messages'}
                        </h1>
                        <p className="text-gray-600">
                            {selectedConversation ? 'Active conversation' : 'Your skill exchange conversations'}
                        </p>
                    </div>
                    {selectedConversation && (
                        <ActionIconButton
                            iconName="ArrowLeft"
                            onClick={() => setSelectedConversation(null)}
                            className="lg:hidden"
                        />
                    )}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden min-h-0">
                <ConversationListPanel
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onSelectConversation={selectConversation}
                    formatTime={formatTime}
                    isVisible={!selectedConversation}
                />
                <ChatWindowPanel
                    selectedConversation={selectedConversation}
                    messages={messages}
                    newMessage={newMessage}
                    onNewMessageChange={(e) => setNewMessage(e.target.value)}
                    onSendMessage={sendMessage}
                    formatTime={formatTime}
                    isVisible={!!selectedConversation}
                />
            </div>
        </div>
    );
}