import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  sessionId: string | null;
  setSessionId: (id: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen(prev => !prev), []);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSessionId(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        toggleChat,
        messages,
        addMessage,
        clearMessages,
        sessionId,
        setSessionId,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
