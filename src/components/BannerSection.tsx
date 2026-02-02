import { X } from 'lucide-react';
import { useState } from 'react';
import type { Section } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface BannerSectionProps {
  section: Section;
}

export default function BannerSection({ section }: BannerSectionProps) {
  const sectionContent = section.content || {};
  const [isVisible, setIsVisible] = useState(true);

  const title = sectionContent.title || '';
  const subtitle = sectionContent.subtitle || '';
  const link = sectionContent.link || '#';
  const dismissible = sectionContent.dismissible !== false;

  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor || '#14b8a6');

  if (!isVisible) return null;

  const handleClick = () => {
    if (link && link !== '#') {
      const element = document.querySelector(link);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id={section.id} className={`py-4 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-left">
            {title && (
              <h3 className="text-white text-lg font-bold mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-white/90 text-sm">
                {subtitle}
              </p>
            )}
          </div>
          {link && link !== '#' && (
            <button
              onClick={handleClick}
              className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Ver más
            </button>
          )}
          {dismissible && (
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-white/80 transition"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
