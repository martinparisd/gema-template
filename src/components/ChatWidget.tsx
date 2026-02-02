import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import ChatbotInterface from './ChatbotInterface';
import type { Widgets, MedicalGroupWebsite } from '../types';

interface ChatWidgetProps {
  widgets: Widgets | null;
  data: MedicalGroupWebsite | null;
  slug: string;
}

export default function ChatWidget({ widgets, data, slug }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const chatbotEnabled = widgets?.chatbot?.enabled ?? widgets?.chatbot_enabled ?? true;
  const whatsappEnabled = widgets?.whatsapp?.enabled ?? widgets?.whatsapp_enabled ?? false;
  const whatsappPhone = widgets?.whatsapp?.phone ?? widgets?.whatsapp_number ?? null;
  const whatsappMessage = widgets?.whatsapp?.message ?? widgets?.whatsapp_message ?? 'Hola, me gustaría hacer una consulta';

  if (!chatbotEnabled) {
    return null;
  }

  const handleWhatsAppRedirect = () => {
    if (whatsappEnabled && whatsappPhone) {
      const phoneNumber = whatsappPhone.replace(/[^\d]/g, '');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 animate-fade-in">
          <ChatbotInterface
            onClose={() => setIsOpen(false)}
            onWhatsAppRedirect={handleWhatsAppRedirect}
            data={data}
            slug={slug}
          />
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-110 active:scale-95"
        aria-label="Chat"
      >
        {isOpen ? (
          <X size={32} className="text-white" />
        ) : (
          <MessageCircle size={32} className="text-white" />
        )}
      </button>
    </div>
  );
}
