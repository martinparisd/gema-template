import type { Section } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface FacilitiesSectionProps {
  section: Section;
}

export default function FacilitiesSection({ section }: FacilitiesSectionProps) {
  const sectionContent = section.content || {};
  const title = sectionContent.title || 'Nuestras Instalaciones';
  const images = sectionContent.images || [];
  const layout = sectionContent.layout || 'grid';

  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor);

  return (
    <section id={section.id} className={`py-12 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {images.map((image: any, index: number) => (
            <div key={index} className="relative group overflow-hidden rounded-2xl shadow-xl">
              <img
                src={image.url}
                alt={image.alt || `Facility ${index + 1}`}
                className="w-full h-72 object-cover transition transform group-hover:scale-110"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white text-lg font-semibold">
                    {image.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
