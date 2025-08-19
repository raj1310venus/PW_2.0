'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, X, HelpCircle } from 'lucide-react';
import '@/styles/Chatbot.css';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  time?: string;
}

const predefinedQuestions = [
  { 
    q: 'What are your store hours?', 
    a: 'We are open Mon–Sat from 9 AM to 8 PM, and Sunday from 10 AM to 6 PM.' 
  },
  { 
    q: 'Where are you located?', 
    a: 'You can find us at 644 Danforth Ave & Pape Ave, Toronto, ON.' 
  },
  { 
    q: 'What is your return policy?', 
    a: 'We accept returns within 30 days of purchase with a valid receipt. Items must be in their original condition.' 
  },
  { 
    q: 'Do you offer delivery?', 
    a: 'We do not offer delivery at the moment, but we are working on providing this service in the near future!' 
  },
];

const CustomChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! How can I help you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const addMessage = (sender: 'user' | 'bot', text: string) => {
    const newMessage: Message = { sender, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMessage]);
  };

  const handlePredefinedQuestionClick = (q: string, a: string) => {
    addMessage('user', q);
    setTimeout(() => {
      addMessage('bot', a);
    }, 500);
  };

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      addMessage('user', input);
      setInput('');
      // Simulate bot response
      setTimeout(() => {
        addMessage('bot', 'Thanks for your message! A representative will get back to you soon.');
      }, 1000);
    }
  };

  return (
    <div>
      <button onClick={toggleOpen} className="chatbot-toggler" title="Toggle Chat" aria-label="Toggle Chat">
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">Support Chat</div>
            <button className="icon-btn" title="Close" aria-label="Close" onClick={toggleOpen}>
              <X size={20} />
            </button>
          </div>
          <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text}
                  <div className="timestamp">{msg.time}</div>
                </div>
              ))}
              {messages.length <= 1 && (
                <div className="predefined-questions">
                  <div className="questions-header">
                    <HelpCircle size={16} />
                    <span>Quick Questions</span>
                  </div>
                  {predefinedQuestions.map((item, i) => (
                    <button key={i} onClick={() => handlePredefinedQuestionClick(item.q, item.a)}>
                      {item.q}
                    </button>
                  ))}
                </div>
              )}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-composer" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button type="submit" className="send-btn" aria-label="Send message">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomChatbot;
