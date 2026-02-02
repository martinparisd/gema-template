import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, User, Mail, Phone, Stethoscope, Shield, FileText, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Section, Doctor, Insurance, AvailableSlotsResponse, BookingSuccessResponse } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';
import { getAvailableSlots, createPublicBooking } from '../services/api';

interface BookingSectionProps {
  section: Section;
  slug: string;
  doctors: Doctor[];
  insurance: Insurance[];
}

interface BookingFormData {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  doctorId: string;
  obraSocial: string;
  plan: string;
  selectedDate: string;
  selectedSlot: string;
  notes: string;
}

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

const DAY_NAMES = ['lu', 'ma', 'mi', 'ju', 'vi', 'sa', 'do'];

export default function BookingSection({ section, slug, doctors, insurance }: BookingSectionProps) {
  const sectionContent = section.content || {};
  const title = sectionContent.title || 'Reservar Turno Online';
  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor);

  const [formData, setFormData] = useState<BookingFormData>({
    dni: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialty: '',
    doctorId: '',
    obraSocial: '',
    plan: '',
    selectedDate: '',
    selectedSlot: '',
    notes: '',
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotsResponse | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<string[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(doctors);
  const [bookingSuccess, setBookingSuccess] = useState<BookingSuccessResponse | null>(null);
  const [bookingError, setBookingError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specialties = Array.from(new Set(doctors.map(d => d.especialidad).filter(Boolean)));

  useEffect(() => {
    if (formData.specialty) {
      const filtered = doctors.filter(d => d.especialidad === formData.specialty);
      setFilteredDoctors(filtered);
      if (filtered.length > 0 && !filtered.find(d => d.id === formData.doctorId)) {
        setFormData(prev => ({ ...prev, doctorId: '' }));
      }
    } else {
      setFilteredDoctors(doctors);
    }
  }, [formData.specialty, doctors]);

  useEffect(() => {
    const selectedObraSocial = insurance.find(i => i.obra_social === formData.obraSocial);
    setAvailablePlans(selectedObraSocial?.planes || []);
    if (!selectedObraSocial?.planes?.includes(formData.plan)) {
      setFormData(prev => ({ ...prev, plan: '' }));
    }
  }, [formData.obraSocial, insurance]);

  useEffect(() => {
    if (formData.doctorId && formData.selectedDate) {
      loadSlots();
    }
  }, [formData.doctorId, formData.selectedDate]);

  const loadSlots = async () => {
    if (!formData.doctorId || !formData.selectedDate) return;

    setLoadingSlots(true);
    try {
      const response = await getAvailableSlots(slug, formData.doctorId, formData.selectedDate);
      setAvailableSlots(response);
    } catch (error) {
      console.error('Error loading slots:', error);
      setAvailableSlots(null);
    } finally {
      setLoadingSlots(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, selectedDate: formattedDate, selectedSlot: '' }));
  };

  const isDateAvailable = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date >= today;
  };

  const isDateSelected = (day: number) => {
    if (!formData.selectedDate) return false;
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return formData.selectedDate === dateString;
  };

  const formatSelectedDate = () => {
    if (!formData.selectedDate) return '';
    const [year, month, day] = formData.selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return `${dayNames[date.getDay()]} ${date.getDate()} de ${MONTHS[date.getMonth()]}`;
  };

  const generateAllTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const allTimeSlots = generateAllTimeSlots();

  const validateForm = (): string | null => {
    if (!formData.dni.trim()) return 'Por favor ingrese su DNI';
    if (!formData.firstName.trim()) return 'Por favor ingrese su nombre';
    if (!formData.lastName.trim()) return 'Por favor ingrese su apellido';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Por favor ingrese un email válido';
    }
    if (!formData.doctorId) return 'Por favor seleccione un médico';
    if (!formData.selectedDate) return 'Por favor seleccione una fecha';
    if (!formData.selectedSlot) return 'Por favor seleccione un horario';
    return null;
  };

  const handleSubmit = async () => {
    setBookingError('');

    const validationError = validateForm();
    if (validationError) {
      setBookingError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedInsurance = insurance.find(i => i.obra_social === formData.obraSocial);

      let phone = formData.phone.trim();
      if (phone && !phone.startsWith('+')) {
        phone = phone.startsWith('54') ? `+${phone}` : `+54${phone.replace(/^0+/, '')}`;
      }

      const response = await createPublicBooking({
        slug,
        doctor_id: formData.doctorId,
        date: formData.selectedDate,
        time: formData.selectedSlot,
        duration: 30,
        patient: {
          dni: formData.dni.trim(),
          nombre: formData.firstName.trim(),
          apellido: formData.lastName.trim(),
          email: formData.email.trim() || undefined,
          telefono: phone || undefined,
          obra_social_id: selectedInsurance?.id,
          plan: formData.plan || undefined,
        },
        notas: formData.notes.trim() || undefined,
      });

      setBookingSuccess(response);
    } catch (error: any) {
      console.error('Booking error:', error);

      if (error.code === 'SLOT_NOT_AVAILABLE') {
        setBookingError('Este horario ya no está disponible. Por favor seleccione otro horario.');
        loadSlots();
      } else if (error.code === 'DOCTOR_NOT_FOUND') {
        setBookingError('El médico seleccionado no está disponible. Por favor seleccione otro médico.');
        setFormData(prev => ({ ...prev, doctorId: '', selectedDate: '', selectedSlot: '' }));
      } else {
        setBookingError(error.message || 'Ocurrió un error al reservar el turno. Por favor intente nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookAnother = () => {
    setBookingSuccess(null);
    setBookingError('');
    setFormData({
      dni: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialty: '',
      doctorId: '',
      obraSocial: '',
      plan: '',
      selectedDate: '',
      selectedSlot: '',
      notes: '',
    });
    setCurrentMonth(new Date());
  };

  if (bookingSuccess) {
    return (
      <section id={section.id} className={`py-12 ${bgStyle.className}`} style={bgStyle.style}>
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.15)' }}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Turno Confirmado!
              </h2>
              <p className="text-gray-600 mb-6">{bookingSuccess.message}</p>

              <div className="bg-primary/10 border-2 border-primary rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Código de Confirmación</p>
                <p className="text-4xl font-bold text-teal-600 tracking-wider mb-2">
                  {bookingSuccess.confirmation_code}
                </p>
                <p className="text-xs text-gray-500">
                  Guarde este código para futuras referencias
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-4">Detalles del Turno</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User size={18} className="text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Profesional</p>
                      <p className="font-medium text-gray-900">{bookingSuccess.turno.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Fecha y Hora</p>
                      <p className="font-medium text-gray-900">
                        {new Date(bookingSuccess.turno.fecha).toLocaleDateString('es-AR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} - {bookingSuccess.turno.hora}
                      </p>
                    </div>
                  </div>
                  {bookingSuccess.patient.historia_clinica && (
                    <div className="flex items-start gap-3">
                      <FileText size={18} className="text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Historia Clínica</p>
                        <p className="font-medium text-gray-900">{bookingSuccess.patient.historia_clinica}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleBookAnother}
                className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Reservar Otro Turno
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={section.id} className={`py-12 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.15)' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CreditCard size={18} className="text-primary" />
                DNI <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="12345678"
                value={formData.dni}
                onChange={(e) => {
                  setFormData({ ...formData, dni: e.target.value });
                  setBookingError('');
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition shadow-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User size={18} className="text-primary" />
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ingrese su nombre"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  setBookingError('');
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition shadow-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User size={18} className="text-primary" />
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ingrese su apellido"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value });
                  setBookingError('');
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail size={18} className="text-primary" />
                Email
              </label>
              <input
                type="email"
                placeholder="ejemplo@email.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setBookingError('');
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition shadow-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone size={18} className="text-primary" />
                Teléfono
              </label>
              <input
                type="tel"
                placeholder="+54 261 123-4567"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  setBookingError('');
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition shadow-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Stethoscope size={18} className="text-primary" />
                Especialidad
              </label>
              <select
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition bg-white shadow-sm"
              >
                <option value="">Seleccione una especialidad</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User size={18} className="text-primary" />
                Médico <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.doctorId}
                onChange={(e) => {
                  setFormData({ ...formData, doctorId: e.target.value, selectedDate: '', selectedSlot: '' });
                  setBookingError('');
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition bg-white shadow-sm"
                disabled={!formData.specialty}
              >
                <option value="">Seleccione un médico</option>
                {filteredDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Shield size={18} className="text-primary" />
                Obra Social
              </label>
              <select
                value={formData.obraSocial}
                onChange={(e) => setFormData({ ...formData, obraSocial: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition bg-white shadow-sm"
              >
                <option value="">Seleccione una obra social</option>
                {insurance.map((ins) => (
                  <option key={ins.id} value={ins.obra_social}>
                    {ins.obra_social}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText size={18} className="text-primary" />
                Plan
              </label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                disabled={!formData.obraSocial || availablePlans.length === 0}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition bg-white shadow-sm disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">
                  {!formData.obraSocial ? 'Seleccione una obra social primero' : availablePlans.length === 0 ? 'No hay planes disponibles' : 'Seleccione un plan'}
                </option>
                {availablePlans.map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t pt-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Fecha y Hora</h3>
            </div>

            {formData.doctorId ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="bg-gray-50 rounded-lg p-4 shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="font-semibold text-gray-900">
                        {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </span>
                      <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {DAY_NAMES.map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-600 py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {getDaysInMonth(currentMonth).map((dayInfo, index) => (
                        <button
                          key={index}
                          disabled={!dayInfo.isCurrentMonth || !isDateAvailable(dayInfo.day!)}
                          onClick={() => dayInfo.day && handleDateSelect(dayInfo.day)}
                          className={`
                            aspect-square rounded-lg text-sm font-medium transition
                            ${!dayInfo.isCurrentMonth ? 'invisible' : ''}
                            ${!isDateAvailable(dayInfo.day!) ? 'text-gray-300 cursor-not-allowed' : ''}
                            ${isDateSelected(dayInfo.day!) ? 'bg-primary text-white' : ''}
                            ${isDateAvailable(dayInfo.day!) && !isDateSelected(dayInfo.day!) ? 'bg-primary/10 text-gray-900 hover:bg-primary/20' : ''}
                          `}
                        >
                          {dayInfo.day}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-primary/10 rounded"></div>
                        <span className="text-gray-600">Disponible</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <span className="text-gray-600">No disponible</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  {formData.selectedDate ? (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar size={18} className="text-primary" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatSelectedDate()}
                        </span>
                      </div>

                      {loadingSlots ? (
                        <div className="text-center py-8 text-gray-500">
                          Cargando horarios...
                        </div>
                      ) : availableSlots && availableSlots.slots.length > 0 ? (
                        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto shadow-md">
                          <div className="grid grid-cols-4 gap-2">
                            {allTimeSlots.map((time) => {
                              const slotData = availableSlots.slots.find(s => s.start === time);
                              const available = slotData?.available || false;
                              const isSelected = formData.selectedSlot === time;

                              return (
                                <button
                                  key={time}
                                  disabled={!available}
                                  onClick={() => available && setFormData({ ...formData, selectedSlot: time })}
                                  className={`
                                    px-3 py-2 rounded-lg text-sm font-medium transition
                                    ${isSelected ? 'bg-primary text-white ring-2 ring-primary' : ''}
                                    ${available && !isSelected ? 'bg-white text-gray-900 hover:bg-primary/10 border border-gray-300' : ''}
                                    ${!available ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''}
                                  `}
                                >
                                  {time}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          {availableSlots?.message || 'No hay horarios disponibles para esta fecha'}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      {formData.doctorId
                        ? `Disponibilidad de ${filteredDoctors.find(d => d.id === formData.doctorId)?.nombre || 'médico'}`
                        : 'Seleccione una fecha para ver disponibilidad'}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                Seleccione un médico para ver la disponibilidad
              </div>
            )}
          </div>

          {formData.selectedSlot && (
            <div className="mt-8 pt-6 border-t">
              {bookingError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{bookingError}</p>
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-secondary disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar Turno'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
