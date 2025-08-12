declare module 'react-simple-chatbot' {
  import * as React from 'react';

  export interface Step {
    id: string | number;
    message?: string;
    trigger?: string | number | ((params: { value: any; steps: any }) => string | number);
    validator?: (value: any) => boolean | string;
    options?: { value: any; label: string; trigger: string | number }[];
    component?: React.ReactElement<any>;
    asMessage?: boolean;
    user?: boolean;
    end?: boolean;
    placeholder?: string;
    hideInput?: boolean;
  }

  export interface ChatBotProps {
    steps: Step[];
    floating?: boolean;
    floatingIcon?: React.ReactNode;
    floatingStyle?: React.CSSProperties;
    headerTitle?: string;
    recognitionEnable?: boolean;
    className?: string;
    style?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    bubbleStyle?: React.CSSProperties;
    bubbleOptionStyle?: React.CSSProperties;
    [key: string]: any;
  }

  const ChatBot: React.ComponentType<ChatBotProps>;

  export default ChatBot;
}
