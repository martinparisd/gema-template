import type { MedicalGroupWebsite, TimeSlot, AvailableSlotsResponse, CreateBookingRequest, ApiResponse, BookingRequest, BookingResponse, BookingSuccessResponse, Theme, Section, Doctor, Service, Insurance, Schedule } from '../types';

const API_BASE_URL = import.meta.env.VITE_GEMA_API_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const headers = {
  'Authorization': `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
};

function transformEdgeFunctionResponse(rawData: any): MedicalGroupWebsite {
  const data = rawData as any;

  console.log('[Transform] Starting transformation. Input data:', data);

  const group = data.group || {};
  const website = data.website || {};

  console.log('[Transform] Extracted group:', group);
  console.log('[Transform] Extracted website:', website);

  const theme: Theme = website.theme || {
    palette: 'blue',
    primary_color: 'hsl(210, 100%, 50%)',
    secondary_color: 'hsl(210, 100%, 40%)',
    font_family: null,
  };

  console.log('[Transform] Theme:', theme);

  const sections: Section[] = Array.isArray(data.sections)
    ? data.sections.map((section: any) => ({
        id: section.id || '',
        type: section.type || 'about',
        order_index: section.order_index ?? 0,
        is_active: section.is_active ?? true,
        is_visible: section.is_active ?? true,
        content: section.content || null,
      }))
    : [];

  console.log('[Transform] Sections:', sections);

  const doctors: Doctor[] = Array.isArray(data.doctors)
    ? data.doctors.map((doctor: any) => ({
        id: doctor.id || '',
        nombre: doctor.nombre || '',
        especialidad: doctor.especialidad || null,
        allowed_obras_sociales: doctor.allowed_obras_sociales || null,
        photo_url: doctor.photo_url || null,
        email: doctor.email || '',
        phone: doctor.phone || '',
        bio: doctor.bio || '',
        is_active: doctor.is_active ?? true,
      }))
    : [];

  console.log('[Transform] Doctors:', doctors);

  const services: Service[] = Array.isArray(data.services)
    ? data.services.map((service: any) => ({
        id: service.id || '',
        name: service.name || '',
        description: service.description || null,
        icon: service.icon || null,
        order_index: service.order_index ?? 0,
        is_active: service.is_active ?? true,
      }))
    : [];

  console.log('[Transform] Services:', services);

  const insurance: Insurance[] = Array.isArray(data.insurance)
    ? data.insurance.map((ins: any) => ({
        id: ins.id || '',
        obra_social: ins.obra_social || '',
        planes: ins.planes || null,
      }))
    : [];

  console.log('[Transform] Insurance:', insurance);

  const schedules: Schedule[] = Array.isArray(data.schedules)
    ? data.schedules.map((schedule: any) => ({
        doctor_id: schedule.doctor_id || '',
        doctor_name: schedule.doctor_name || '',
        dia_semana: schedule.dia_semana ?? 0,
        hora_inicio: schedule.hora_inicio || '',
        hora_fin: schedule.hora_fin || '',
        consultorio_name: schedule.consultorio_name || null,
        consultorio_address: schedule.consultorio_address || null,
      }))
    : [];

  console.log('[Transform] Schedules:', schedules);

  const result: MedicalGroupWebsite = {
    group: {
      id: group.id || '',
      name: group.name || '',
      slug: group.slug || '',
      logo_url: group.logo_url || null,
      specialty: group.specialty || null,
      addresses: group.addresses || null,
      email: group.email || null,
    },
    website: {
      theme: website.theme || null,
      contact: website.contact || null,
      socials: website.socials || null,
      widgets: website.widgets || null,
      seo: website.seo || null,
    },
    sections,
    services,
    doctors,
    insurance,
    schedules,
    medical_group_id: group.id || '',
    medical_group_name: group.name || '',
    logo_url: group.logo_url || null,
    theme,
  };

  console.log('[Transform] Final result:', result);

  return result;
}

export async function getMedicalGroupWebsite(slug: string): Promise<MedicalGroupWebsite> {
  console.log('[API] Fetching medical group website for slug:', slug);
  console.log('[API] Request URL:', `${API_BASE_URL}/get-medical-group-website?slug=${slug}`);
  console.log('[API] Request headers:', headers);

  const response = await fetch(
    `${API_BASE_URL}/get-medical-group-website?slug=${slug}`,
    { headers }
  );

  console.log('[API] Response status:', response.status);
  console.log('[API] Response ok:', response.ok);
  console.log('[API] Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[API] Error response body:', errorText);
    throw new Error('Failed to fetch medical group website');
  }

  const rawText = await response.text();
  console.log('[API] Raw response body:', rawText);

  let parsedResponse: any;
  try {
    parsedResponse = JSON.parse(rawText);
    console.log('[API] Parsed JSON result:', parsedResponse);
  } catch (e) {
    console.error('[API] Failed to parse JSON:', e);
    throw new Error('Invalid JSON response from API');
  }

  // Check if response has an error property
  if (parsedResponse.error) {
    console.error('[API] API returned error:', parsedResponse.error);
    throw new Error(parsedResponse.error);
  }

  // The API returns data directly, or wrapped in { data: ... }
  let data: any;
  if (parsedResponse.data) {
    console.log('[API] Response has data property, using it');
    data = parsedResponse.data;
  } else if (parsedResponse.group || parsedResponse.website) {
    console.log('[API] Response is direct data (has group/website), using it directly');
    data = parsedResponse;
  } else {
    console.error('[API] No data in response. Full result:', parsedResponse);
    throw new Error('No data received from API');
  }

  console.log('[API] Data before transformation:', data);
  const transformed = transformEdgeFunctionResponse(data);
  console.log('[API] Data after transformation:', transformed);

  return transformed;
}

export async function getAvailableSlots(
  slug: string,
  doctorId: string,
  date: string,
  duration: number = 30
): Promise<AvailableSlotsResponse> {
  const params = new URLSearchParams({
    slug: slug,
    doctor_id: doctorId,
    date: date,
    duration: duration.toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/get-available-slots?${params}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch available slots');
  }

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error);
  }

  return result as AvailableSlotsResponse;
}

export async function createPublicBooking(booking: BookingRequest): Promise<BookingSuccessResponse> {
  const response = await fetch(
    `${API_BASE_URL}/create-public-booking`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(booking),
    }
  );

  const result: BookingResponse = await response.json();

  if (!result.success) {
    const error = new Error(result.message);
    (error as any).code = result.error;
    throw error;
  }

  return result;
}
