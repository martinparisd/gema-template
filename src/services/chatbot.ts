import type { ChatMessage, ChatIntent, ChatContext, MedicalGroupWebsite, QuickReply } from '../types';
import { getMedicalGroupWebsite } from './api';

const intents: ChatIntent[] = [
  {
    key: 'greeting',
    patterns: ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'hello', 'hi'],
    responses: [
      '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte hoy?',
      '¡Bienvenido! Estoy aquí para ayudarte. ¿Qué necesitas?',
    ],
    quickReplies: [
      { label: '📅 Reservar turno', value: 'booking' },
      { label: 'ℹ️ Información general', value: 'info' },
      { label: '⏰ Horarios', value: 'schedule' },
      { label: '📍 Ubicación', value: 'location' },
    ],
  },
  {
    key: 'booking',
    patterns: ['turno', 'cita', 'consulta', 'reservar', 'agendar', 'appointment', 'book'],
    responses: [
      'Perfecto, puedo ayudarte a reservar un turno. ¿Qué tipo de consulta necesitas?',
    ],
    nextIntent: 'booking_service',
  },
  {
    key: 'schedule',
    patterns: ['horario', 'hora', 'cuando', 'abierto', 'schedule', 'hours'],
    responses: [],
  },
  {
    key: 'location',
    patterns: ['donde', 'ubicacion', 'direccion', 'como llego', 'location', 'address'],
    responses: [],
  },
  {
    key: 'insurance',
    patterns: ['obra social', 'prepaga', 'seguro', 'cobertura', 'insurance'],
    responses: [],
  },
  {
    key: 'emergency',
    patterns: ['urgencia', 'emergencia', 'urgente', 'emergency', 'urgent'],
    responses: [
      '⚠️ Para emergencias médicas, te recomiendo contactar directamente por WhatsApp o llamar al centro médico.',
      '⚠️ Si es una emergencia, por favor comunícate inmediatamente por WhatsApp o teléfono.',
    ],
    quickReplies: [
      { label: '📱 Contactar por WhatsApp', value: 'whatsapp' },
    ],
  },
  {
    key: 'info',
    patterns: ['info', 'información', 'servicios', 'que hacen', 'especialidades'],
    responses: [
      '¿Qué información necesitas?',
    ],
    quickReplies: [
      { label: '🏥 Servicios', value: 'services' },
      { label: '👨‍⚕️ Médicos', value: 'doctors' },
      { label: '💳 Obras sociales', value: 'insurance' },
      { label: '📍 Ubicación', value: 'location' },
    ],
  },
  {
    key: 'services',
    patterns: ['servicio', 'tratamiento', 'que ofrecen'],
    responses: [],
  },
  {
    key: 'doctors',
    patterns: ['medico', 'doctor', 'profesional', 'especialista'],
    responses: [],
  },
  {
    key: 'thanks',
    patterns: ['gracias', 'muchas gracias', 'thank', 'thanks'],
    responses: [
      '¡De nada! ¿Hay algo más en lo que pueda ayudarte?',
      '¡Un placer ayudarte! Si necesitas algo más, aquí estoy.',
    ],
    quickReplies: [
      { label: '📅 Reservar turno', value: 'booking' },
      { label: '📱 Contactar por WhatsApp', value: 'whatsapp' },
    ],
  },
  {
    key: 'whatsapp',
    patterns: ['whatsapp', 'wa', 'chat', 'hablar con alguien', 'contactar'],
    responses: [
      '¡Por supuesto! Puedo conectarte con nuestro equipo por WhatsApp.',
    ],
  },
];

export class ChatbotService {
  private data: MedicalGroupWebsite | null;
  private slug: string;
  private dataCache: MedicalGroupWebsite | null = null;
  private lastFetch: number = 0;
  private cacheDuration: number = 5 * 60 * 1000;

  constructor(data: MedicalGroupWebsite | null, slug: string) {
    this.data = data;
    this.slug = slug;
    this.dataCache = data;
  }

  async getFreshData(): Promise<MedicalGroupWebsite | null> {
    const now = Date.now();

    if (this.dataCache && (now - this.lastFetch) < this.cacheDuration) {
      return this.dataCache;
    }

    try {
      const freshData = await getMedicalGroupWebsite(this.slug);
      this.dataCache = freshData;
      this.lastFetch = now;
      return freshData;
    } catch (error) {
      console.error('Error fetching fresh data:', error);
      return this.dataCache || this.data;
    }
  }

  generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  matchIntent(userMessage: string): ChatIntent | null {
    const normalizedMessage = userMessage.toLowerCase().trim();

    for (const intent of intents) {
      for (const pattern of intent.patterns) {
        if (normalizedMessage.includes(pattern)) {
          return intent;
        }
      }
    }

    return null;
  }

  getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async generateResponse(userMessage: string, context: ChatContext): Promise<ChatMessage[]> {
    const intent = this.matchIntent(userMessage);
    const messages: ChatMessage[] = [];

    if (!intent) {
      messages.push({
        id: this.generateId(),
        sender: 'bot',
        content: 'Disculpa, no estoy seguro de entender. ¿Podrías reformular tu pregunta?',
        timestamp: new Date(),
        type: 'text',
        quickReplies: [
          { label: '📅 Reservar turno', value: 'booking' },
          { label: 'ℹ️ Información', value: 'info' },
          { label: '📱 Hablar con alguien', value: 'whatsapp' },
        ],
      });
      return messages;
    }

    const freshData = await this.getFreshData();

    switch (intent.key) {
      case 'schedule':
        messages.push(this.getScheduleResponse(freshData));
        break;

      case 'location':
        messages.push(this.getLocationResponse(freshData));
        break;

      case 'insurance':
        messages.push(this.getInsuranceResponse(freshData));
        break;

      case 'services':
        messages.push(this.getServicesResponse(freshData));
        break;

      case 'doctors':
        messages.push(this.getDoctorsResponse(freshData));
        break;

      case 'whatsapp':
        messages.push({
          id: this.generateId(),
          sender: 'bot',
          content: this.getRandomResponse(intent.responses),
          timestamp: new Date(),
          type: 'handoff',
          quickReplies: intent.quickReplies,
        });
        break;

      default:
        if (intent.responses.length > 0) {
          messages.push({
            id: this.generateId(),
            sender: 'bot',
            content: this.getRandomResponse(intent.responses),
            timestamp: new Date(),
            type: intent.quickReplies ? 'quick_replies' : 'text',
            quickReplies: intent.quickReplies,
          });
        }
    }

    return messages;
  }

  getWelcomeMessage(): ChatMessage {
    const groupName = this.data?.group?.name || 'nuestro centro médico';

    return {
      id: this.generateId(),
      sender: 'bot',
      content: `¡Hola! Bienvenido a ${groupName}. Soy tu asistente virtual y estoy aquí para ayudarte. ¿En qué puedo asistirte hoy?`,
      timestamp: new Date(),
      type: 'quick_replies',
      quickReplies: [
        { label: '📅 Reservar turno', value: 'booking' },
        { label: 'ℹ️ Información general', value: 'info' },
        { label: '⏰ Horarios', value: 'schedule' },
        { label: '📱 Contactar por WhatsApp', value: 'whatsapp' },
      ],
    };
  }

  getScheduleResponse(data: MedicalGroupWebsite | null): ChatMessage {
    if (!data?.schedules || data.schedules.length === 0) {
      return {
        id: this.generateId(),
        sender: 'bot',
        content: 'Para conocer nuestros horarios de atención, te recomiendo contactarnos directamente.',
        timestamp: new Date(),
        type: 'quick_replies',
        quickReplies: [
          { label: '📱 Contactar por WhatsApp', value: 'whatsapp' },
          { label: '📅 Reservar turno', value: 'booking' },
        ],
      };
    }

    const daysMap: { [key: number]: string } = {
      0: 'Domingo',
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado',
    };

    const schedulesByDay: { [key: number]: string[] } = {};
    data.schedules.forEach((schedule) => {
      if (!schedulesByDay[schedule.dia_semana]) {
        schedulesByDay[schedule.dia_semana] = [];
      }
      schedulesByDay[schedule.dia_semana].push(
        `${schedule.hora_inicio} - ${schedule.hora_fin}`
      );
    });

    let scheduleText = '📅 Nuestros horarios de atención:\n\n';
    Object.keys(schedulesByDay)
      .sort()
      .forEach((day) => {
        const dayNum = parseInt(day);
        scheduleText += `${daysMap[dayNum]}: ${schedulesByDay[dayNum].join(', ')}\n`;
      });

    return {
      id: this.generateId(),
      sender: 'bot',
      content: scheduleText,
      timestamp: new Date(),
      type: 'quick_replies',
      quickReplies: [
        { label: '📅 Reservar turno', value: 'booking' },
        { label: '📱 Contactar', value: 'whatsapp' },
      ],
    };
  }

  getLocationResponse(data: MedicalGroupWebsite | null): ChatMessage {
    const address = data?.group?.addresses;
    const email = data?.group?.email;
    const contact = data?.website?.contact;

    let locationText = '📍 Información de contacto:\n\n';

    if (address) {
      locationText += `Dirección: ${typeof address === 'string' ? address : JSON.stringify(address)}\n`;
    }

    if (contact?.phone) {
      locationText += `📞 Teléfono: ${contact.phone}\n`;
    }

    if (email || contact?.email) {
      locationText += `📧 Email: ${email || contact?.email}\n`;
    }

    if (!address && !contact?.phone && !email && !contact?.email) {
      locationText = 'Para conocer nuestra ubicación y datos de contacto, por favor comunícate con nosotros.';
    }

    return {
      id: this.generateId(),
      sender: 'bot',
      content: locationText,
      timestamp: new Date(),
      type: 'quick_replies',
      quickReplies: [
        { label: '📅 Reservar turno', value: 'booking' },
        { label: '📱 Contactar por WhatsApp', value: 'whatsapp' },
      ],
    };
  }

  getInsuranceResponse(data: MedicalGroupWebsite | null): ChatMessage {
    if (!data?.insurance || data.insurance.length === 0) {
      return {
        id: this.generateId(),
        sender: 'bot',
        content: 'Para consultar sobre obras sociales y coberturas aceptadas, te recomiendo contactarnos directamente.',
        timestamp: new Date(),
        type: 'quick_replies',
        quickReplies: [
          { label: '📱 Contactar por WhatsApp', value: 'whatsapp' },
        ],
      };
    }

    let insuranceText = '💳 Obras sociales que aceptamos:\n\n';
    data.insurance.forEach((ins) => {
      insuranceText += `• ${ins.obra_social}`;
      if (ins.planes && ins.planes.length > 0) {
        insuranceText += ` (${ins.planes.join(', ')})`;
      }
      insuranceText += '\n';
    });

    return {
      id: this.generateId(),
      sender: 'bot',
      content: insuranceText,
      timestamp: new Date(),
      type: 'quick_replies',
      quickReplies: [
        { label: '📅 Reservar turno', value: 'booking' },
        { label: '📱 Contactar', value: 'whatsapp' },
      ],
    };
  }

  getServicesResponse(data: MedicalGroupWebsite | null): ChatMessage {
    if (!data?.services || data.services.length === 0) {
      return {
        id: this.generateId(),
        sender: 'bot',
        content: 'Para conocer nuestros servicios, te recomiendo contactarnos directamente.',
        timestamp: new Date(),
        type: 'quick_replies',
        quickReplies: [
          { label: '📱 Contactar por WhatsApp', value: 'whatsapp' },
        ],
      };
    }

    let servicesText = '🏥 Nuestros servicios:\n\n';
    data.services
      .filter(s => s.is_active)
      .slice(0, 5)
      .forEach((service) => {
        servicesText += `• ${service.name}`;
        if (service.description) {
          servicesText += `\n  ${service.description}`;
        }
        servicesText += '\n';
      });

    if (data.services.filter(s => s.is_active).length > 5) {
      servicesText += '\n...y más servicios disponibles.';
    }

    return {
      id: this.generateId(),
      sender: 'bot',
      content: servicesText,
      timestamp: new Date(),
      type: 'quick_replies',
      quickReplies: [
        { label: '📅 Reservar turno', value: 'booking' },
        { label: '👨‍⚕️ Ver médicos', value: 'doctors' },
      ],
    };
  }

  getDoctorsResponse(data: MedicalGroupWebsite | null): ChatMessage {
    if (!data?.doctors || data.doctors.length === 0) {
      return {
        id: this.generateId(),
        sender: 'bot',
        content: 'Para conocer a nuestros profesionales, te recomiendo contactarnos directamente.',
        timestamp: new Date(),
        type: 'quick_replies',
        quickReplies: [
          { label: '📱 Contactar por WhatsApp', value: 'whatsapp' },
        ],
      };
    }

    let doctorsText = '👨‍⚕️ Nuestros profesionales:\n\n';
    data.doctors
      .filter(d => d.is_active)
      .slice(0, 5)
      .forEach((doctor) => {
        doctorsText += `• Dr./Dra. ${doctor.nombre}`;
        if (doctor.especialidad) {
          doctorsText += ` - ${doctor.especialidad}`;
        }
        doctorsText += '\n';
      });

    if (data.doctors.filter(d => d.is_active).length > 5) {
      doctorsText += '\n...y más profesionales en nuestro equipo.';
    }

    return {
      id: this.generateId(),
      sender: 'bot',
      content: doctorsText,
      timestamp: new Date(),
      type: 'quick_replies',
      quickReplies: [
        { label: '📅 Reservar turno', value: 'booking' },
        { label: '🏥 Ver servicios', value: 'services' },
      ],
    };
  }
}
