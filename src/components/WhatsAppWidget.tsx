import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import type { Widgets } from '../types';

interface WhatsAppWidgetProps {
  widgets: Widgets | null;
}

export default function WhatsAppWidget({ widgets }: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappEnabled = widgets?.whatsapp?.enabled ?? widgets?.whatsapp_enabled ?? false;
  const whatsappPhone = widgets?.whatsapp?.phone ?? widgets?.whatsapp_number ?? null;
  const whatsappMessage = widgets?.whatsapp?.message ?? widgets?.whatsapp_message ?? 'Hola, me gustaría hacer una consulta';

  if (!widgets || !whatsappEnabled || !whatsappPhone) {
    return null;
  }

  const phoneNumber = whatsappPhone.replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 bg-white rounded-lg shadow-2xl p-5 max-w-sm animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle size={24} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-base">WhatsApp</p>
                <p className="text-sm text-gray-500">En línea</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            ¿Necesitas ayuda? Chatea con nosotros
          </p>
          <button
            onClick={handleClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            Iniciar chat
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-110 active:scale-95"
        aria-label="WhatsApp"
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
