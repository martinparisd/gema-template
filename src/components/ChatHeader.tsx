import { X, RefreshCw, MessageCircle } from 'lucide-react';

interface ChatHeaderProps {
  title?: string;
  onClose: () => void;
  onReset?: () => void;
}

export default function ChatHeader({ title = 'Asistente Virtual', onClose, onReset }: ChatHeaderProps) {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <MessageCircle size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-base">{title}</h3>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-blue-100">En línea</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onReset && (
          <button
            onClick={onReset}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition"
            aria-label="Nueva conversación"
            title="Nueva conversación"
          >
            <RefreshCw size={18} />
          </button>
        )}
        <button
          onClick={onClose}
          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition"
          aria-label="Cerrar chat"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
