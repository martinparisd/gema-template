import { Bot, User } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
  onQuickReplyClick?: (value: string) => void;
}

export default function ChatMessage({ message, onQuickReplyClick }: ChatMessageProps) {
  const isBot = message.sender === 'bot';

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <Bot size={18} className="text-white" />
        </div>
      )}

      <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} max-w-[75%]`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isBot
              ? 'bg-gray-100 text-gray-900 rounded-tl-none'
              : 'bg-blue-500 text-white rounded-tr-none'
          }`}
        >
          <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
        </div>

        {message.quickReplies && message.quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => onQuickReplyClick?.(reply.value)}
                className="px-3 py-1.5 text-sm bg-white border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition"
              >
                {reply.label}
              </button>
            ))}
          </div>
        )}

        <span className="text-xs text-gray-400 mt-1">{formatTime(message.timestamp)}</span>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
          <User size={18} className="text-gray-600" />
        </div>
      )}
    </div>
  );
}
