import * as Icons from 'lucide-react';
import type { Section, Service } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface ServicesSectionProps {
  section: Section;
  services: Service[];
  onBookService: (service: Service) => void;
}

const getIconComponent = (iconName: string | null) => {
  if (!iconName) return Icons.Stethoscope;

  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Stethoscope;
};

const extractTextFromContent = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value.text || value.label || value.title || value.description || '';
  }
  return '';
};

export default function ServicesSection({ section, services, onBookService }: ServicesSectionProps) {
  const activeServices = services.filter(s => s.is_active).sort((a, b) => a.order_index - b.order_index);

  const sectionContent = section.content || {};
  const title = extractTextFromContent(sectionContent.title) || extractTextFromContent(sectionContent) || 'Áreas de Especialización';
  const subtitle = extractTextFromContent(sectionContent.subtitle) || extractTextFromContent(sectionContent.description) || 'Contamos con profesionales especializados en diferentes áreas de la medicina';

  const displayImage = sectionContent.image || 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800';

  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor || '#ffffff');

  const shouldCascade = activeServices.length >= 6;

  const displayServices = activeServices.length > 0 ? activeServices : [
    { id: '1', name: 'ANGIOLOGÍA', is_active: true, order_index: 0 },
    { id: '2', name: 'CARDIOLOGÍA', is_active: true, order_index: 1 },
    { id: '3', name: 'CIRUGÍA GENERAL', is_active: true, order_index: 2 },
    { id: '4', name: 'CIRUGÍA INFANTIL', is_active: true, order_index: 3 },
    { id: '5', name: 'ODONTOLOGÍA', is_active: true, order_index: 4 },
    { id: '6', name: 'ONCOLOGÍA', is_active: true, order_index: 5 },
    { id: '7', name: 'PEDIATRÍA', is_active: true, order_index: 6 },
    { id: '8', name: 'MEDICINA INTERNA', is_active: true, order_index: 7 },
  ] as Service[];

  return (
    <section id={section.id} className={`py-12 ${bgStyle.className}`} style={bgStyle.style}>
      <style>{`
        @keyframes continuousCascade {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .cascade-container {
          position: relative;
          height: 400px;
          overflow: hidden;
        }

        .cascade-container::before,
        .cascade-container::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 80px;
          pointer-events: none;
          z-index: 10;
        }

        .cascade-container::before {
          top: 0;
          background: linear-gradient(to bottom, ${bgStyle.style?.backgroundColor || '#ffffff'} 0%, transparent 100%);
        }

        .cascade-container::after {
          bottom: 0;
          background: linear-gradient(to top, ${bgStyle.style?.backgroundColor || '#ffffff'} 0%, transparent 100%);
        }

        .cascade-scroll {
          animation: continuousCascade 20s linear infinite;
        }

        .cascade-container:hover .cascade-scroll {
          animation-play-state: paused;
        }
      `}</style>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold mb-3">
            NUESTRAS ESPECIALIDADES
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className={shouldCascade ? 'cascade-container' : ''}>
              {shouldCascade ? (
                <div className="cascade-scroll">
                  <div className="grid grid-cols-2 gap-4">
                    {displayServices.map((service) => (
                      <div key={service.id} className="text-center">
                        <div className="bg-white border-2 border-primary text-primary rounded-lg px-4 py-3 hover:bg-primary/10 transition font-semibold text-sm">
                          {service.name.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {displayServices.map((service) => (
                      <div key={`${service.id}-duplicate`} className="text-center">
                        <div className="bg-white border-2 border-primary text-primary rounded-lg px-4 py-3 hover:bg-primary/10 transition font-semibold text-sm">
                          {service.name.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {displayServices.map((service) => (
                    <div key={service.id} className="text-center">
                      <div className="bg-white border-2 border-primary text-primary rounded-lg px-4 py-3 hover:bg-primary/10 transition font-semibold text-sm">
                        {service.name.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={displayImage}
                alt="Especialidades médicas"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
