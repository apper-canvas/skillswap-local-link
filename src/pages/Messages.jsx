import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { messageService } from '../services';

export default function Messages() {
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
      // Group messages by conversation
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
      
      // Update conversation list
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
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
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
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedConversation(null)}
              className="p-2 text-gray-400 hover:text-gray-600 lg:hidden"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </motion.button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Conversations List */}
        <div className={`${selectedConversation ? 'hidden lg:block' : 'block'} w-full lg:w-80 flex-shrink-0 bg-white border-r border-surface-200 overflow-y-auto`}>
          {conversations.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12 px-4"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="MessageCircle" className="w-16 h-16 text-gray-300 mx-auto" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No conversations yet</h3>
              <p className="mt-2 text-gray-500">Start connecting with neighbors to begin chatting</p>
            </motion.div>
          ) : (
            <div className="divide-y divide-surface-200">
              {conversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => selectConversation(conversation)}
                  className={`p-4 cursor-pointer hover:bg-surface-50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-primary/5 border-r-2 border-primary' : ''
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
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className={`${selectedConversation ? 'block' : 'hidden lg:block'} flex-1 flex flex-col min-w-0`}>
          {selectedConversation ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => {
                  const isOwn = message.senderId === 'current-user';
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
                })}
              </div>

              {/* Message Input */}
              <div className="flex-shrink-0 border-t border-surface-200 p-4">
                <form onSubmit={sendMessage} className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-surface border border-surface-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-primary text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                  >
                    <ApperIcon name="Send" size={18} />
                  </motion.button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ApperIcon name="MessageCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}