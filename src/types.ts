export interface Theme {
  palette?: string;
  primary_color?: string;
  secondary_color?: string;
  font_family?: string | null;
  colors?: {
    primary: string;
    secondary: string;
  };
  font?: {
    family: string;
    headings: string;
  };
  borderRadius?: string;
}

export interface Contact {
  phone: string | null;
  email: string | null;
  address: string | null;
}

export interface Socials {
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  youtube: string | null;
}

export interface Widgets {
  whatsapp_enabled?: boolean;
  whatsapp_number?: string | null;
  whatsapp_message?: string | null;
  whatsapp?: {
    enabled: boolean;
    phone: string | null;
    message: string | null;
  };
  chatbot_enabled?: boolean;
  chatbot?: {
    enabled: boolean;
    welcome_message?: string;
  };
}

export interface SEO {
  title: string | null;
  description: string | null;
  keywords: string | null;
}

export interface Website {
  theme: Theme | null;
  contact: Contact | null;
  socials: Socials | null;
  widgets: Widgets | null;
  seo: SEO | null;
}

export interface Section {
  id: string;
  type: 'hero' | 'about' | 'services' | 'doctors' | 'contact' | 'testimonials' | 'insurance' |
        'text' | 'cards' | 'gallery' | 'video' | 'facilities' | 'booking' | 'cta' |
        'banner' | 'stats' | 'schedule' | 'map' | 'faq' | 'divider' | 'footer';
  order_index: number;
  is_active: boolean;
  is_visible?: boolean;
  content: any;
}

export interface Doctor {
  id: string;
  nombre: string;
  especialidad: string | null;
  allowed_obras_sociales: string[] | null;
  photo_url?: string | null;
  email?: string;
  phone?: string;
  bio?: string;
  is_active?: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  order_index: number;
  is_active: boolean;
}

export interface Insurance {
  id: string;
  obra_social: string;
  planes: string[] | null;
}

export interface Schedule {
  doctor_id: string;
  doctor_name: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  consultorio_name: string | null;
  consultorio_address: string | null;
}

export interface MedicalGroup {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  specialty: string | null;
  addresses: any | null;
  email: string | null;
}

export interface MedicalGroupWebsite {
  group: MedicalGroup;
  website: Website;
  sections: Section[];
  services: Service[];
  doctors: Doctor[];
  insurance: Insurance[];
  schedules: Schedule[];
  medical_group_id: string;
  medical_group_name: string;
  logo_url: string | null;
  theme: Theme;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface AvailableSlotsResponse {
  doctor: {
    id: string;
    nombre: string;
  };
  date: string;
  duration: number;
  slots: TimeSlot[];
  message?: string;
}

export interface BookingFormData {
  patient_first_name: string;
  patient_last_name: string;
  patient_email: string;
  patient_phone: string;
  patient_date_of_birth: string;
  notes?: string;
}

export interface CreateBookingRequest extends BookingFormData {
  medical_group_id: string;
  doctor_id: string;
  service_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PatientData {
  dni: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  obra_social_id?: string;
  plan?: string;
}

export interface BookingRequest {
  slug: string;
  doctor_id: string;
  date: string;
  time: string;
  duration?: number;
  service_ids?: string[];
  patient: PatientData;
  notas?: string;
}

export interface BookingSuccessResponse {
  success: true;
  turno_id: string;
  confirmation_code: string;
  message: string;
  turno: {
    fecha: string;
    hora: string;
    doctor: string;
  };
  patient: {
    historia_clinica: string | null;
  };
}

export interface BookingErrorResponse {
  success: false;
  error: 'INVALID_DATA' | 'SLOT_NOT_AVAILABLE' | 'GROUP_NOT_FOUND' | 'DOCTOR_NOT_FOUND' | 'INTERNAL_ERROR';
  message: string;
}

export type BookingResponse = BookingSuccessResponse | BookingErrorResponse;

export type MessageSender = 'bot' | 'user';

export type MessageType = 'text' | 'quick_replies' | 'typing' | 'handoff';

export interface QuickReply {
  label: string;
  value: string;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  content: string;
  timestamp: Date;
  type: MessageType;
  quickReplies?: QuickReply[];
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  context: ChatContext;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatContext {
  currentIntent?: string;
  userInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  appointmentInfo?: {
    doctorId?: string;
    serviceId?: string;
    date?: string;
    time?: string;
  };
}

export interface ChatIntent {
  key: string;
  patterns: string[];
  responses: string[];
  quickReplies?: QuickReply[];
  nextIntent?: string;
}
