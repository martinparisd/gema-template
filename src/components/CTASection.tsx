import { Heart, ArrowRight } from 'lucide-react';
import type { Section } from '../types';

interface CTASectionProps {
  section: Section;
}

export default function CTASection({ section }: CTASectionProps) {
  const sectionContent = section.content || {};
  const title = sectionContent.title || 'Trabajamos con GEMA Soluciones Médicas';
  const subtitle = sectionContent.subtitle || 'Una plataforma innovadora que nos permite tener un mejor control y cuidado de nuestros pacientes, optimizando la gestión médica y mejorando la calidad de atención en cada consulta.';
  const buttonText = sectionContent.buttonText || 'Conocer más sobre GEMA';
  const buttonLink = sectionContent.buttonLink || 'https://gemasm.com';

  const handleClick = () => {
    if (buttonLink.startsWith('tel:') || buttonLink.startsWith('mailto:')) {
      window.location.href = buttonLink;
    } else if (buttonLink.startsWith('http')) {
      window.open(buttonLink, '_blank');
    } else {
      const element = document.querySelector(buttonLink);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id={section.id} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <Heart className="text-white" size={36} strokeWidth={2} />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {title}
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              {subtitle}
            </p>

            <button
              onClick={handleClick}
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-secondary transition shadow-md"
            >
              {buttonText}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
