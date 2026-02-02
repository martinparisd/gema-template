import { Shield, Check } from 'lucide-react';
import type { Section, Insurance } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface InsuranceSectionProps {
  section: Section;
  insurance: Insurance[];
}

export default function InsuranceSection({ section, insurance }: InsuranceSectionProps) {
  const sectionContent = section.content || {};
  const title = typeof sectionContent === 'string' ? 'Obras Sociales' : (sectionContent.title || 'Obras Sociales');
  const subtitle = typeof sectionContent === 'string' ? sectionContent : (sectionContent.subtitle || sectionContent.description || 'Trabajamos con las principales obras sociales y prepagas');

  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor || '#f9fafb');

  return (
    <section id={section.id} className={`py-12 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
            <Shield size={28} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {insurance.map((ins) => (
            <div
              key={ins.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-5"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {ins.obra_social}
                  </h3>
                  {ins.planes && ins.planes.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2 font-semibold">Planes disponibles:</p>
                      <div className="grid gap-1" style={{ gridTemplateRows: 'repeat(4, auto)', gridAutoFlow: 'column', gridAutoColumns: 'minmax(0, 1fr)' }}>
                        {ins.planes.map((plan, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <Check size={14} className="text-green-600 flex-shrink-0" />
                            <span>{plan}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
