'use client';

import dynamic from 'next/dynamic';

const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false });

const ChatbotLoader = () => {
  return <Chatbot />;
};

export default ChatbotLoader;
