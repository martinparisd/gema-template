import { Calendar } from 'lucide-react';
import type { Section } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface HeroSectionProps {
  section: Section;
  onBookAppointment: () => void;
}

const extractTextFromContent = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value.text || value.label || value.title || '';
  }
  return '';
};

export default function HeroSection({ section, onBookAppointment }: HeroSectionProps) {
  const sectionContent = section.content || {};
  const title = extractTextFromContent(sectionContent.title) || extractTextFromContent(sectionContent) || 'Bienvenidos';
  const subtitle = extractTextFromContent(sectionContent.subtitle) || extractTextFromContent(sectionContent.description) || '';
  const ctaText = extractTextFromContent(sectionContent.cta?.text || sectionContent.cta) || 'Solicitar Turno';
  const imageUrl = sectionContent.image || 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1200';

  const backgroundColor = sectionContent.backgroundColor;
  const bgStyle = backgroundColor && backgroundColor !== 'transparent'
    ? getBackgroundStyle(backgroundColor)
    : { className: 'bg-primary', style: { background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))' } };

  return (
    <section
      id={section.id}
      className={`relative ${bgStyle.className} py-20 overflow-hidden`}
      style={bgStyle.style}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="text-white lg:pr-8">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg mb-8 leading-relaxed text-white/90">
                {subtitle}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onBookAppointment}
                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-50 transition shadow-lg hover:shadow-xl"
              >
                <Calendar size={20} />
                {ctaText}
              </button>
              <button
                onClick={onBookAppointment}
                className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-secondary transition hover:opacity-90"
              >
                Llamar Ahora
              </button>
            </div>
          </div>

          <div className="relative max-w-lg mx-auto lg:ml-auto lg:mr-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-2">
              <img
                src={imageUrl}
                alt="Atención médica profesional"
                className="w-full h-80 object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl p-6">
              <div className="text-primary text-3xl font-bold mb-1">15+</div>
              <div className="text-gray-600 text-sm font-semibold">Años de Experiencia</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
