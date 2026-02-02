import { Mail, Phone, UserCircle, Calendar, Clock, Building2, Shield } from 'lucide-react';
import type { Section, Doctor, Insurance, Schedule } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface DoctorsSectionProps {
  section: Section;
  doctors: Doctor[];
  insurance?: Insurance[];
  schedules?: Schedule[];
  onBookDoctor: (doctor: Doctor) => void;
}

const getDayName = (dayNum: number): string => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[dayNum] || '';
};

const extractTextFromContent = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value.text || value.label || value.title || value.description || '';
  }
  return '';
};

export default function DoctorsSection({ section, doctors, insurance, schedules, onBookDoctor }: DoctorsSectionProps) {
  const activeDoctors = doctors.filter(d => d.is_active);

  const sectionContent = section.content || {};
  const title = extractTextFromContent(sectionContent.title) || extractTextFromContent(sectionContent) || 'Nuestros Profesionales';
  const subtitle = extractTextFromContent(sectionContent.subtitle) || extractTextFromContent(sectionContent.description) || 'Equipo de profesionales comprometidos con tu salud';

  const getDoctorSchedules = (doctorId: string) => {
    if (!schedules) return [];
    return schedules.filter(s => s.doctor_id === doctorId);
  };

  const getDoctorInsurance = (doctorId: string, allowedIds: string[] | null) => {
    if (!insurance || !allowedIds) return [];
    return insurance.filter(ins => allowedIds.includes(ins.id));
  };

  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor || '#ffffff');

  return (
    <section id={section.id} className={`py-20 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {activeDoctors.map((doctor) => {
            const doctorSchedules = getDoctorSchedules(doctor.id);
            const doctorInsurance = getDoctorInsurance(doctor.id, doctor.allowed_obras_sociales);

            return (
              <div
                key={doctor.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  {doctor.photo_url ? (
                    <img
                      src={doctor.photo_url}
                      alt={`Dr. ${doctor.nombre}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle size={120} className="text-blue-600" />
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Dr. {doctor.nombre}
                  </h3>
                  {doctor.especialidad && (
                    <p className="text-blue-600 font-semibold mb-4">
                      {doctor.especialidad}
                    </p>
                  )}
                  {doctor.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {doctor.bio}
                    </p>
                  )}

                  {(doctor.phone || doctor.email) && (
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      {doctor.phone && (
                        <a
                          href={`tel:${doctor.phone}`}
                          className="flex items-center gap-2 hover:text-blue-600 transition"
                        >
                          <Phone size={16} />
                          <span>{doctor.phone}</span>
                        </a>
                      )}
                      {doctor.email && (
                        <a
                          href={`mailto:${doctor.email}`}
                          className="flex items-center gap-2 hover:text-blue-600 transition"
                        >
                          <Mail size={16} />
                          <span>{doctor.email}</span>
                        </a>
                      )}
                    </div>
                  )}

                  {doctorSchedules.length > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Calendar size={16} />
                        <span>Horarios</span>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        {doctorSchedules.map((schedule, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Clock size={12} className="mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium">{getDayName(schedule.dia_semana)}</div>
                              <div>{schedule.hora_inicio.slice(0, 5)} - {schedule.hora_fin.slice(0, 5)}</div>
                              {schedule.consultorio_name && (
                                <div className="flex items-center gap-1 text-gray-500 mt-0.5">
                                  <Building2 size={10} />
                                  <span>{schedule.consultorio_name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {doctorInsurance.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 mb-2">
                        <Shield size={16} />
                        <span>Obras Sociales</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {doctorInsurance.map((ins) => (
                          <span
                            key={ins.id}
                            className="text-xs px-2 py-1 bg-white rounded-full text-blue-600 border border-blue-200"
                          >
                            {ins.obra_social}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => onBookDoctor(doctor)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-auto"
                  >
                    Reservar Turno
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
