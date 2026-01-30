import { useEffect, useRef, useState, useCallback } from 'react';
import { X, MessageSquare, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../context/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedQuestions from './SuggestedQuestions';

export default function ChatDrawer() {
  const {
    isOpen,
    closeChat,
    messages,
    addMessage,
    clearMessages,
    sessionId,
    setSessionId,
    isLoading,
    setIsLoading,
  } = useChat();

  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch suggested questions
  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          if (data.suggestedQuestions) {
            setSuggestedQuestions(data.suggestedQuestions.map((q: { question: string }) => q.question));
          }
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      }
    }
    fetchSuggestions();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Cancel any in-flight request when drawer closes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    }
    return () => {
      document.body.style.overflow = '';
      // Cleanup on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [isOpen]);

  const sendMessage = useCallback(async (content: string) => {
    // Cancel any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Add user message
    addMessage({ role: 'user', content });
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content }],
          sessionId,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      const data = await response.json();
      addMessage({ role: 'assistant', content: data.response });

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }
    } catch (err) {
      // Don't show error message if request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Chat request cancelled');
        return;
      }
      console.error('Chat error:', err);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setIsLoading(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [messages, sessionId, addMessage, setIsLoading, setSessionId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="chat-drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} className="text-[--color-teal]" />
                <span className="font-medium">Ask Me Anything</span>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={clearMessages}
                    className="p-2 text-[--color-text-muted] hover:text-[--color-text-primary] transition-colors"
                    title="Clear chat"
                  >
                    <RotateCcw size={18} />
                  </button>
                )}
                <button
                  onClick={closeChat}
                  className="p-2 text-[--color-text-muted] hover:text-[--color-text-primary] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[--color-teal]/10 flex items-center justify-center">
                      <MessageSquare size={28} className="text-[--color-teal]" />
                    </div>
                    <h3 className="font-medium mb-2">Let's chat</h3>
                    <p className="text-sm text-[--color-text-muted] max-w-xs mx-auto">
                      Ask me about my experience, skills, or anything else you'd like to know.
                    </p>
                  </div>
                  <SuggestedQuestions
                    questions={suggestedQuestions}
                    onSelect={sendMessage}
                    disabled={isLoading}
                  />
                </>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <ChatMessage key={index} role={msg.role} content={msg.content} />
                  ))}
                  {isLoading && (
                    <div className="chat-message-assistant">
                      <div className="typing-indicator">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
