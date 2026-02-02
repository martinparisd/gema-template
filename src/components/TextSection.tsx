import type { Section } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface TextSectionProps {
  section: Section;
}

export default function TextSection({ section }: TextSectionProps) {
  const sectionContent = section.content || {};
  const title = sectionContent.title || '';
  const content = sectionContent.content || '';
  const align = sectionContent.align || 'center';

  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor);

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align] || 'text-center';

  return (
    <section id={section.id} className={`py-12 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4">
        <div className={`max-w-4xl mx-auto ${alignmentClass}`}>
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
          )}
          {content && (
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
