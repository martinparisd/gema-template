import * as Icons from 'lucide-react';
import type { Section } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface StatsSectionProps {
  section: Section;
}

const getIconComponent = (iconName: string | null) => {
  if (!iconName) return Icons.TrendingUp;
  const formattedName = iconName.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
  const IconComponent = (Icons as any)[formattedName];
  return IconComponent || Icons.TrendingUp;
};

export default function StatsSection({ section }: StatsSectionProps) {
  const sectionContent = section.content || {};
  const title = sectionContent.title || '';
  const items = sectionContent.items || [];

  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor || '#1e293b');

  return (
    <section id={section.id} className={`py-16 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {items.map((item: any, index: number) => {
            const Icon = getIconComponent(item.icon);
            return (
              <div
                key={index}
                className="text-center text-white"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4">
                  <Icon size={28} />
                </div>
                <div className="text-4xl font-bold mb-2">
                  {item.value}
                </div>
                <div className="text-white/80 text-sm">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
