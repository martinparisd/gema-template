import { Clock } from 'lucide-react';
import type { Section } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface ScheduleSectionProps {
  section: Section;
}

export default function ScheduleSection({ section }: ScheduleSectionProps) {
  const sectionContent = section.content || {};
  const title = sectionContent.title || 'Horarios de Atención';
  const rows = sectionContent.rows || [];

  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor);

  return (
    <section id={section.id} className={`py-12 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
              <Clock size={28} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                {rows.map((row: any, index: number) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {row.day}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {row.from && row.to ? `${row.from} - ${row.to}` : 'Cerrado'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
