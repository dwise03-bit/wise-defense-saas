'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader, Mic, MicOff, Volume2, Play, Pause, StopCircle } from 'lucide-react';

interface QuickReply {
  label: string;
  action: string;
  icon?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  quickReplies?: QuickReply[];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const getInitialMessages = (): Message[] => [
    {
      role: 'assistant',
      content: 'Hi! 👋 I\'m Wise Defense\'s AI assistant. I can help with bookings, memberships, training questions, and more. How can I help you today?',
      quickReplies: [
        { label: '💰 View Pricing', action: 'pricing', icon: '💰' },
        { label: '📅 Book a Session', action: 'booking', icon: '📅' },
        { label: '📖 Course Info', action: 'courses', icon: '📖' },
        { label: '☎️ Contact Us', action: 'contact', icon: '☎️' },
      ]
    }
  ];

  const [messages, setMessages] = useState<Message[]>(getInitialMessages());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [token, setToken] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice chat state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Text-to-speech state
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Timer
      const interval = setInterval(() => {
        setRecordingTime(t => {
          if (t >= 60) {
            clearInterval(interval);
            stopVoiceRecording();
            return 60;
          }
          return t + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Microphone access denied:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '🎤 Microphone access denied. Please enable microphone permissions and try again.'
      }]);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const speakMessage = (text: string, messageId: number) => {
    // Cancel any current speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    setSpeakingMessageId(messageId);
    setIsSpeaking(true);

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    synthRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      setIsSpeaking(false);
    }
  };

  const resumeSpeech = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsSpeaking(true);
    }
  };

  const stopSpeech = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpeakingMessageId(null);
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setLoading(true);

      // Create FormData for audio
      const formData = new FormData();
      formData.append('audio', audioBlob);

      // Use Web Speech API for transcription
      const reader = new FileReader();
      reader.readAsArrayBuffer(audioBlob);
      reader.onload = async () => {
        // Fallback: show user they need to speak clearly
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '🎤 Voice message received. Transcribing...'
        }]);

        // For now, prompt user to confirm what they said
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Could you type what you said? (Voice transcription coming soon)'
        }]);
      };
    } catch (error) {
      console.error('Transcription error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, voice transcription failed. Please type your message instead.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const alertQuickReply = async (reply: QuickReply) => {
    try {
      await fetch('/api/chat/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quick_reply',
          action: reply.action,
          label: reply.label,
          conversationId
        })
      });
    } catch (error) {
      console.error('Failed to send quick reply alert:', error);
    }
  };

  const handleQuickReply = async (reply: QuickReply) => {
    setLoading(true);

    // Add user action to UI
    setMessages(prev => [...prev, { role: 'user', content: reply.label }]);

    // Alert Discord of quick reply action
    await alertQuickReply(reply);

    try {
      // Route based on action
      if (reply.action === 'booking') {
        window.location.href = '/booking';
        return;
      } else if (reply.action === 'pricing') {
        window.location.href = '/pricing';
        return;
      } else if (reply.action === 'escalate') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '👤 **You\'re connected with our support team!**\n\n📧 Email: support@wisedefense.com\n☎️ Phone: 1-800-WISE-DEF (Mon-Fri 8 AM-8 PM EST)\n💬 Discord: Join our community\n\nSomeone will reach out within 2 hours. Thank you for your patience!'
        }]);
        setLoading(false);
        return;
      } else if (reply.action === 'contact') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `📧 **Email:** support@wisedefense.com (2-hour response)\n☎️ **Phone:** 1-800-WISE-DEF (Mon-Fri 8 AM-8 PM EST)\n💬 **Discord:** Join our community\n\nWe're here to help! What can we solve for you?`,
          quickReplies: [
            { label: 'Back to Chat', action: 'reset', icon: '💬' }
          ]
        }]);
        setLoading(false);
        return;
      } else if (reply.action === 'reset') {
        // Reset to welcome message
        setMessages([
          {
            role: 'assistant',
            content: 'Hi! 👋 I\'m Wise Defense\'s AI assistant. I can help with bookings, memberships, training questions, and more. How can I help you today?',
            quickReplies: getWelcomeQuickReplies()
          }
        ]);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          message: reply.label,
          conversationId,
          channel: 'web'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setConversationId(data.conversationId);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          quickReplies: data.quickReplies || getContextualReplies(reply.action)
        }]);
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

  const getWelcomeQuickReplies = (): QuickReply[] => [
    { label: '💰 View Pricing', action: 'pricing', icon: '💰' },
    { label: '📅 Book a Session', action: 'booking', icon: '📅' },
    { label: '📖 Course Info', action: 'courses', icon: '📖' },
    { label: '☎️ Contact Us', action: 'contact', icon: '☎️' },
  ];

  const getContextualReplies = (context: string): QuickReply[] => {
    const commonReplies: QuickReply[] = [
      { label: '📅 Book Now', action: 'booking', icon: '📅' },
      { label: '💰 See Pricing', action: 'pricing', icon: '💰' },
      { label: '❓ Another Question', action: 'reset', icon: '❓' },
    ];
    return commonReplies;
  };

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
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          quickReplies: data.quickReplies || getContextualReplies('general')
        }]);

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
          color: '#ffffff',
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
          <div key={idx}>
            <div
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* TTS Button for assistant messages */}
                {msg.role === 'assistant' && msg.content && (
                  <div className="flex flex-col gap-1">
                    {speakingMessageId === idx ? (
                      <>
                        <button
                          onClick={() => pauseSpeech()}
                          className="p-1.5 bg-neon-red text-black rounded hover:bg-opacity-90 transition-all"
                          title="Pause speech"
                        >
                          <Pause size={14} />
                        </button>
                        {isSpeaking && (
                          <button
                            onClick={() => stopSpeech()}
                            className="p-1 bg-red-700 text-white rounded text-xs hover:bg-red-800 transition-all"
                            title="Stop speech"
                          >
                            <StopCircle size={12} />
                          </button>
                        )}
                      </>
                    ) : speechSynthesis.paused && speakingMessageId === idx ? (
                      <button
                        onClick={() => resumeSpeech()}
                        className="p-1.5 bg-neon-red text-black rounded hover:bg-opacity-90 transition-all"
                        title="Resume speech"
                      >
                        <Play size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => speakMessage(msg.content, idx)}
                        className="p-1.5 bg-gray-700 text-neon-red hover:bg-gray-600 rounded transition-all"
                        title="Read aloud (Text-to-Speech)"
                      >
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-neon-red text-black rounded-br-none'
                      : `bg-gray-800 text-silver rounded-bl-none ${speakingMessageId === idx ? 'ring-2 ring-neon-red' : ''}`
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>

            {/* Quick Reply Buttons */}
            {msg.quickReplies && msg.quickReplies.length > 0 && (
              <div className="flex justify-start mt-2">
                <div className="flex flex-wrap gap-2 max-w-xs">
                  {msg.quickReplies.map((reply, replyIdx) => (
                    <button
                      key={replyIdx}
                      onClick={() => handleQuickReply(reply)}
                      disabled={loading || isSpeaking}
                      className="px-3 py-1.5 text-xs bg-gradient-to-r from-neon-red to-red-600 text-black rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold whitespace-nowrap"
                      title={reply.label}
                    >
                      {reply.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
        {isRecording && (
          <div className="bg-red-900 bg-opacity-30 border border-neon-red rounded px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-red rounded-full animate-pulse"></div>
              <span className="text-sm text-neon-red font-semibold">Recording... {recordingTime}s</span>
            </div>
            <button
              onClick={stopVoiceRecording}
              className="text-neon-red hover:text-red-400 transition-colors"
            >
              <MicOff size={16} />
            </button>
          </div>
        )}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything... or click 🎤 to speak"
          className="w-full bg-gray-900 text-silver border border-gray-700 rounded px-3 py-2 text-sm focus:border-neon-red focus:outline-none resize-none"
          rows={3}
          disabled={loading || isRecording || isSpeaking}
        />
        <div className="flex gap-2">
          <button
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            disabled={loading || isSpeaking}
            className={`p-2 rounded transition-all ${
              isRecording
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-800 text-neon-red hover:bg-gray-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isSpeaking ? 'Stop speech first' : (isRecording ? 'Stop recording' : 'Start voice message (max 60s)')}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim() || isRecording || isSpeaking}
            className="flex-1 bg-neon-red text-black font-semibold py-2 rounded hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Send size={16} />
            Send
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 px-4 py-2 text-xs text-gray-400 text-center">
        🤖 Hermes AI • 🎤 Voice Input • 🔊 Audio Output • 24/7
      </div>
    </div>
  );
}
