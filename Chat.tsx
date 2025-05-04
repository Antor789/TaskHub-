import React, { useState, useRef, useEffect } from 'react';
import { Send, UserPlus, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ChatMessage from '../components/chat/ChatMessage';
import { Message, User } from '../types';

const Chat: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();
  const [messageText, setMessageText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock users for the chat
  const users: User[] = [
    { id: 'user-1', name: 'John Doe', email: 'john@example.com', avatar: null, role: 'admin' },
    { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', avatar: null, role: 'member' },
    { id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com', avatar: null, role: 'member' }
  ];
  
  // Generate mock messages
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        content: 'Hey team, how is the progress on the new feature?',
        userId: 'user-1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        isRead: true,
        user: users[0]
      },
      {
        id: 'msg-2',
        content: 'I\'ve finished the design mockups. Will share them shortly.',
        userId: 'user-2',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isRead: true,
        user: users[1]
      },
      {
        id: 'msg-3',
        content: 'Great progress! I\'ve started implementing the API endpoints.',
        userId: 'user-3',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        isRead: true,
        user: users[2]
      },
      {
        id: 'msg-4',
        content: 'Can we schedule a quick meeting to discuss the integration points?',
        userId: 'user-1',
        timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
        isRead: true,
        user: users[0]
      }
    ];
    
    setMessages(mockMessages);
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !currentUser) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: messageText,
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
      isRead: false,
      user: currentUser
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
  };
  
  if (!currentUser) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Team Chat</h1>
        
        <div className="flex space-x-2">
          <button className={`p-2 rounded-full ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <UserPlus size={18} />
          </button>
          <button className={`p-2 rounded-full ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <Settings size={18} />
          </button>
        </div>
      </div>
      
      <div className={`flex-1 flex flex-col overflow-hidden rounded-lg shadow-sm ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map(message => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              currentUser={currentUser}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message input */}
        <div className={`p-4 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className={`flex-1 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'bg-gray-100 border border-gray-200 text-gray-800'
              }`}
            />
            <button
              type="submit"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition duration-150"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;