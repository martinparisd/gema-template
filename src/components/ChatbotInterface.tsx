import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { ChatbotService } from '../services/chatbot';
import type { ChatMessage as ChatMessageType, ChatContext, MedicalGroupWebsite } from '../types';

interface ChatbotInterfaceProps {
  onClose: () => void;
  onWhatsAppRedirect: () => void;
  data: MedicalGroupWebsite | null;
  slug: string;
}

export default function ChatbotInterface({ onClose, onWhatsAppRedirect, data, slug }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [context, setContext] = useState<ChatContext>({});
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatbotService = useRef(new ChatbotService(data, slug));

  useEffect(() => {
    const welcomeMessage = chatbotService.current.getWelcomeMessage();
    setMessages([welcomeMessage]);
    saveToLocalStorage([welcomeMessage]);
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      const handleScroll = () => {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        setShowScrollButton(!isNearBottom);
      };

      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    if (!isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  const saveToLocalStorage = (msgs: ChatMessageType[]) => {
    try {
      const sessionData = {
        messages: msgs.map(m => ({
          ...m,
          timestamp: m.timestamp.toISOString(),
        })),
        context,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('chatbot_session', JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    const userMessage: ChatMessageType = {
      id: chatbotService.current.generateId(),
      sender: 'user',
      content: messageText,
      timestamp: new Date(),
      type: 'text',
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveToLocalStorage(newMessages);

    setIsTyping(true);

    setTimeout(async () => {
      const botResponses = await chatbotService.current.generateResponse(messageText, context);

      const updatedMessages = [...newMessages, ...botResponses];
      setMessages(updatedMessages);
      saveToLocalStorage(updatedMessages);
      setIsTyping(false);

      const hasHandoff = botResponses.some(msg => msg.type === 'handoff');
      if (hasHandoff) {
        setTimeout(() => {
          onWhatsAppRedirect();
        }, 1500);
      }
    }, 800 + Math.random() * 400);
  };

  const handleQuickReply = (value: string) => {
    if (value === 'whatsapp') {
      onWhatsAppRedirect();
      return;
    }

    const quickReplyLabels: { [key: string]: string } = {
      booking: '📅 Reservar turno',
      info: 'ℹ️ Información general',
      schedule: '⏰ Horarios',
      location: '📍 Ubicación',
      services: '🏥 Servicios',
      doctors: '👨‍⚕️ Médicos',
      insurance: '💳 Obras sociales',
    };

    handleSendMessage(quickReplyLabels[value] || value);
  };

  const handleReset = () => {
    setMessages([]);
    setContext({});
    setIsTyping(false);
    localStorage.removeItem('chatbot_session');

    setTimeout(() => {
      const welcomeMessage = chatbotService.current.getWelcomeMessage();
      setMessages([welcomeMessage]);
      saveToLocalStorage([welcomeMessage]);
    }, 100);
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden">
      <ChatHeader
        title={data?.group?.name || 'Asistente Virtual'}
        onClose={onClose}
        onReset={handleReset}
      />

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 relative"
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onQuickReplyClick={handleQuickReply}
          />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />

        {showScrollButton && (
          <button
            onClick={() => scrollToBottom()}
            className="fixed bottom-24 right-8 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition animate-fade-in"
            aria-label="Ir al final"
          >
            <ArrowDown size={20} />
          </button>
        )}
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
}
