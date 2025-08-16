'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../styles/Chatbot.css';

const CustomChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: 'Hi! I’m your assistant. How can I help you today?',
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const newUserMessage = {
      text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');

    // Mock bot response
    setTimeout(() => {
      const botResponse = {
        text: `You said: ${text}\n(This is a mock response)`,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  return (
    <div className="chatbot" id="chatbot-root">
      <div
        className="chatbot__panel"
        role="dialog"
        aria-label="Chatbot"
        aria-hidden={!isOpen}
      >
        <div className="chatbot__header">
          <div className="chatbot__title">Support Chat</div>
          <div className="chatbot__controls">
            <button className="icon-btn" title="Close" aria-label="Close" onClick={toggleChat}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <div className="chatbot__messages" id="messages" aria-live="polite">
          {messages.map((msg, index) => (
            <div key={index} className={`msg msg--${msg.sender}`}>
              <div className="bubble">{msg.text}</div>
              <span className="timestamp">{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="chatbot__composer" id="composer" onSubmit={handleSendMessage} autoComplete="off">
          <textarea
            className="chatbot__input"
            rows={1}
            placeholder="Type a message…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          ></textarea>
          <button className="chatbot__send" type="submit" aria-label="Send">Send</button>
        </form>
      </div>

      <button className="chatbot__launcher" id="launcher" aria-label="Open chat" title="Chat" onClick={toggleChat}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
        </svg>
        {messages.length > 0 && !isOpen && (
          <span className="chatbot__badge" id="badge" aria-hidden="true">1</span>
        )}
      </button>
    </div>
  );
};

export default CustomChatbot;
