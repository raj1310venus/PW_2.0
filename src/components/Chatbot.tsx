'use client';

import React from 'react';
import ChatBot, { Step } from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

// Define a theme that matches the store's dark aesthetic
const theme = {
  background: '#1F2937', // dark gray
  fontFamily: 'sans-serif',
  headerBgColor: '#D97706', // amber-600
  headerFontColor: '#fff',
  headerFontSize: '16px',
  botBubbleColor: '#D97706', // amber-600
  botFontColor: '#fff',
  userBubbleColor: '#374151', // gray-700
  userFontColor: '#fff',
};

// Define the conversation steps
const steps: Step[] = [
  {
    id: '1',
    message: 'Hello! Welcome to Price War Store. How can I help you today?',
    trigger: '2',
  },
  {
    id: '2',
    options: [
      { value: 1, label: 'Store hours?', trigger: '3' },
      { value: 2, label: 'Location?', trigger: '4' },
      { value: 3, label: 'Product categories?', trigger: '5' },
      { value: 4, label: 'Return policy?', trigger: '6' },
      { value: 5, label: 'Shipping info?', trigger: '7' },
    ],
  },
  {
    id: '3',
    message: 'We are open Mon-Sat 9AM-8PM, and Sun 10AM-6PM.',
    trigger: '8',
  },
  {
    id: '4',
    message: 'We are located at 644 Danforth Ave & Pape Ave, Toronto, ON.',
    trigger: '8',
  },
  {
    id: '5',
    message:
      'We sell Clothing, Luggage, Bath & Linen, Household Appliances, Utensils, and more.',
    trigger: '8',
  },
  {
    id: '6',
    message:
      'We accept returns within 30 days of purchase with a valid receipt. Some restrictions may apply.',
    trigger: '8',
  },
  {
    id: '7',
    message: 'We offer free standard shipping on all orders over $75.',
    trigger: '8',
  },
  {
    id: '8',
    message: 'Is there anything else I can help with?',
    trigger: '2',
  },
];

const CustomChatbotIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28px" height="28px">
    <path d="M4.913 2.647c-.922.43-1.523 1.39-1.523 2.476v8.752c0 1.087.6 2.046 1.523 2.476l8.487 3.98c.922.43 2.03.43 2.952 0l8.487-3.98c.922-.43 1.523-1.39 1.523-2.476V5.123c0-1.087-.6-2.046-1.523-2.476L16.353.17c-.922-.43-2.03-.43-2.952 0L4.913 2.647zM13.5 14.25a.75.75 0 000-1.5h-3a.75.75 0 000 1.5h3zM12 8.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 8.25z" />
  </svg>
);

const Chatbot = () => (
  <ThemeProvider theme={theme}>
    <ChatBot
      steps={steps}
      floating={true}
      floatingIcon={CustomChatbotIcon}
      floatingStyle={{ zIndex: 1000 }}
      headerTitle="Price War Assistant"
      recognitionEnable={true}
    />
  </ThemeProvider>
);

export default Chatbot;
