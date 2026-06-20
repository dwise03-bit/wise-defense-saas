'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! 👋 I\'m Wise Defense\'s AI assistant. I can help with bookings, memberships, training questions, and more. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [token, setToken] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId,
          channel: 'web'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setConversationId(data.conversationId);
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);

        if (data.escalated) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '📞 A support agent will reach out to you shortly. We typically respond within 2 hours during business hours.'
          }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message || 'Sorry, I encountered an error.' }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-40"
        style={{
          backgroundColor: '#ff1744',
          color: '#000000',
        }}
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 w-96 h-[600px] rounded-lg shadow-2xl flex flex-col z-50"
      style={{
        backgroundColor: '#1a1a1a',
        border: '2px solid #ff1744',
      }}>
      {/* Header */}
      <div
        className="px-4 py-3 rounded-t-lg flex items-center justify-between"
        style={{
          backgroundColor: '#ff1744',
          color: '#000000',
        }}>
        <div>
          <h3 className="font-bold">Wise Defense Assistant</h3>
          <p className="text-xs text-black opacity-80">Always here to help</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-black hover:bg-opacity-20 rounded transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-neon-red text-black rounded-br-none'
                  : 'bg-gray-800 text-silver rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
              <Loader size={16} className="animate-spin text-neon-red" />
              <span className="text-sm text-gray-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 p-4 space-y-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything..."
          className="w-full bg-gray-900 text-silver border border-gray-700 rounded px-3 py-2 text-sm focus:border-neon-red focus:outline-none resize-none"
          rows={3}
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="w-full bg-neon-red text-black font-semibold py-2 rounded hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <Send size={16} />
          Send
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 px-4 py-2 text-xs text-gray-400 text-center">
        Powered by AI • Escalate to human agent anytime
      </div>
    </div>
  );
}
