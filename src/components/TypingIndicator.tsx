import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex gap-2 justify-start mb-4 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
        <Bot size={18} className="text-white" />
      </div>

      <div className="flex items-center gap-1 px-4 py-3 rounded-2xl bg-gray-100 rounded-tl-none">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}
