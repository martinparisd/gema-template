import { Star, Quote } from 'lucide-react';
import type { Section } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface TestimonialsSectionProps {
  section: Section;
}

export default function TestimonialsSection({ section }: TestimonialsSectionProps) {
  const sectionContent = section.content || {};
  const title = sectionContent.title || 'Lo que dicen nuestros pacientes';
  const items = sectionContent.items || [];

  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor);

  return (
    <section id={section.id} className={`py-12 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Quote size={20} className="text-primary" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  {item.rating && (
                    <div className="flex gap-1">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm italic">
                "{item.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
