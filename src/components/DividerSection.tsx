import type { Section } from '../types';

interface DividerSectionProps {
  section: Section;
}

export default function DividerSection({ section }: DividerSectionProps) {
  const sectionContent = section.content || {};
  const style = sectionContent.style || 'line';
  const height = sectionContent.height || 1;
  const color = sectionContent.color || '#e2e8f0';

  return (
    <section id={section.id} className="py-0">
      <div className="container mx-auto px-4">
        <div
          style={{
            height: `${height}px`,
            backgroundColor: color,
            width: '100%'
          }}
        />
      </div>
    </section>
  );
}
