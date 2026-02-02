import { Heart, Users, Award, Clock } from 'lucide-react';
import type { Section } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface AboutSectionProps {
  section: Section;
}

const extractTextFromContent = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value.text || value.label || value.title || value.description || '';
  }
  return '';
};

export default function AboutSection({ section }: AboutSectionProps) {
  const features = [
    { icon: Heart, title: 'Atención Especializada', description: 'Equipo multidisciplinario de profesionales especializados en oncología' },
    { icon: Users, title: 'Atención Personalizada', description: 'Cada paciente recibe un plan de tratamiento adaptado a sus necesidades' },
    { icon: Award, title: 'Tecnología Avanzada', description: 'Equipamiento de última generación para diagnóstico y tratamiento' },
  ];

  const sectionContent = section.content || {};
  const title = extractTextFromContent(sectionContent.title) || extractTextFromContent(sectionContent) || 'Sobre Nosotros';
  const description = extractTextFromContent(sectionContent.description) || extractTextFromContent(sectionContent.subtitle) || 'Contamos con instalaciones modernas y tecnología de vanguardia para garantizar los mejores resultados en el cuidado de nuestros pacientes.';

  const sectionType = sectionContent.type || 'default';

  if (sectionType === 'installations' || sectionContent.installations) {
    const bgStyle = getBackgroundStyle(sectionContent.backgroundColor || '#1e293b');
    return (
      <section id={section.id} className={`py-12 ${bgStyle.className} text-white`} style={bgStyle.style}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                INSTALACIONES
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Instalaciones Modernas
              </h2>
              <p className="text-base text-gray-300 mb-6 leading-relaxed">
                Contamos con instalaciones equipadas con la última tecnología médica para ofrecer diagnósticos precisos y tratamientos efectivos en un ambiente cómodo y profesional.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Award size={14} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Equipos de Última Generación</h4>
                    <p className="text-gray-400 text-sm">Tecnología avanzada para diagnóstico y tratamiento</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart size={14} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Ambiente Confortable</h4>
                    <p className="text-gray-400 text-sm">Espacios diseñados para tu comodidad y tranquilidad</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users size={14} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Protocolos de Seguridad</h4>
                    <p className="text-gray-400 text-sm">Cumplimiento estricto de normativas sanitarias</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden shadow-xl transform -rotate-2">
                <img
                  src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Instalaciones médicas"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl transform rotate-2 mt-6">
                <img
                  src="https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Atención médica"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor || '#ffffff');
  return (
    <section id={section.id} className={`py-12 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold mb-3">
            QUIÉNES SOMOS
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = ['bg-primary', 'bg-blue-500', 'bg-cyan-500'];
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6 text-center"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 ${colors[index]} text-white rounded-2xl mb-3`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
