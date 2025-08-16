'use client';

import dynamic from 'next/dynamic';

const CustomChatbot = dynamic(() => import('@/components/CustomChatbot'), { ssr: false });

const ChatbotLoader = () => {
  return <CustomChatbot />;
};

export default ChatbotLoader;
