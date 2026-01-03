import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    // ✅ CONNECT TO YOUR EXISTING SERVER ON PORT 5000
    const websocket = new WebSocket('ws://localhost:5000/ws');
    
    websocket.onopen = () => {
      console.log('✅ Connected to chat server');
      setIsConnected(true);
    };

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, message]);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    websocket.onclose = () => {
      console.log('❌ Disconnected from chat server');
      setIsConnected(false);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(websocket);

    // Cleanup on unmount
    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() && ws && isConnected) {
      // Send message to server
      ws.send(JSON.stringify({
        text: inputMessage.trim(),
        user: 'Customer' // You can change this to use actual username
      }));
      
      // Add your own message to the chat immediately
      setMessages(prev => [...prev, {
        type: 'chat',
        message: inputMessage.trim(),
        user: 'You',
        timestamp: new Date().toISOString(),
        time: new Date().toLocaleTimeString()
      }]);
      
      setInputMessage('');
    }
  };

  const getMessageColor = (user) => {
    if (user === 'System') return 'bg-yellow-100 border-yellow-200';
    if (user === 'You') return 'bg-blue-100 border-blue-200';
    return 'bg-gray-100 border-gray-200';
  };

  const getMessagePosition = (user) => {
    if (user === 'You') return 'justify-end';
    if (user === 'System') return 'justify-center';
    return 'justify-start';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="bg-green-500 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">💬 Customer Support</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm mt-1">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-300'}`}></div>
          <span>{isConnected ? 'Connected to support' : 'Disconnected'}</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-80 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">💬</div>
            <p>No messages yet. Start chatting with support!</p>
            <p className="text-sm mt-2">Our team will respond shortly.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${getMessagePosition(msg.user)} mb-3`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg border ${getMessageColor(msg.user)}`}>
                {msg.user !== 'System' && msg.user !== 'You' && (
                  <div className="font-semibold text-sm text-gray-600">{msg.user}</div>
                )}
                <div className="text-gray-800">{msg.message}</div>
                <div className="text-xs text-gray-500 text-right mt-1">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || !isConnected}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimpleChat;