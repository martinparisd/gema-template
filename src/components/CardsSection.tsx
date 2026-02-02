import * as Icons from 'lucide-react';
import type { Section } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface CardsSectionProps {
  section: Section;
}

const getIconComponent = (iconName: string | null) => {
  if (!iconName) return Icons.Star;
  const IconComponent = (Icons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)];
  return IconComponent || Icons.Star;
};

export default function CardsSection({ section }: CardsSectionProps) {
  const sectionContent = section.content || {};
  const title = sectionContent.title || '';
  const cards = sectionContent.cards || [];
  const columns = sectionContent.columns || 3;

  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor);

  const gridClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  }[columns] || 'md:grid-cols-3';

  return (
    <section id={section.id} className={`py-12 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            {title}
          </h2>
        )}
        <div className={`grid grid-cols-1 ${gridClass} gap-6 max-w-6xl mx-auto`}>
          {cards.map((card: any, index: number) => {
            const Icon = getIconComponent(card.icon);
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6 text-center"
              >
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : card.icon ? (
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-primary text-white rounded-2xl mb-4">
                    <Icon size={28} />
                  </div>
                ) : null}
                {card.title && (
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                )}
                {card.description && (
                  <p className="text-gray-600 text-sm">
                    {card.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
