import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
      <div className="flex gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          disabled={disabled}
          rows={1}
          className="flex-1 bg-[--color-surface] border border-white/10 rounded-lg px-4 py-3 text-sm text-[--color-text-primary] placeholder:text-[--color-text-muted] resize-none focus:outline-none focus:border-[--color-teal] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="p-3 bg-[--color-teal] rounded-lg text-[--color-background] disabled:opacity-50 disabled:cursor-not-allowed hover:glow-teal transition-all"
        >
          <Send size={18} />
        </button>
      </div>
      <p className="text-xs text-[--color-text-muted] mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
