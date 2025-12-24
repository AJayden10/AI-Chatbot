import { create } from 'zustand';
import type { Message } from '@/types/chat.types';

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    sender: 'bot',
    timestamp: new Date(Date.now() - 60_000),
  },
];

interface ChatStore {
  messages: Message[];
  isTyping: boolean;
  addMessage: (content: string, sender: 'user' | 'bot') => void;
  setTyping: (value: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: mockMessages,
  isTyping: false,

  addMessage: (content, sender) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  setTyping: (isTyping) => set({ isTyping }),
}));