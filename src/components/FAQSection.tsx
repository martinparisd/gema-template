import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { Section } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface FAQSectionProps {
  section: Section;
}

export default function FAQSection({ section }: FAQSectionProps) {
  const sectionContent = section.content || {};
  const title = sectionContent.title || 'Preguntas Frecuentes';
  const items = sectionContent.items || [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id={section.id} className={`py-12 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
              <HelpCircle size={28} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
          <div className="space-y-4">
            {items.map((item: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-primary flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-gray-600">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
