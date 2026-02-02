import { Heart } from 'lucide-react';
import type { MedicalGroupWebsite } from '../types';

interface GEMASectionProps {
  website: MedicalGroupWebsite;
}

export default function GEMASection({ website }: GEMASectionProps) {
  const primaryColor = website.theme?.colors?.primary || website.theme?.primary_color || '#14b8a6';
  const secondaryColor = website.theme?.colors?.secondary || website.theme?.secondary_color || '#0f766e';

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                <Heart size={32} className="text-white" fill="currentColor" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Trabajamos con GEMA Soluciones Médicas
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Una plataforma innovadora que nos permite tener un mejor control y cuidado de nuestros pacientes, optimizando la gestión médica y mejorando la calidad de atención en cada consulta.
            </p>

            <a
              href="https://gemasm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white font-semibold px-8 py-3 rounded-lg transition transform hover:scale-105"
              style={{
                backgroundColor: primaryColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = secondaryColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor;
              }}
            >
              Conocer más sobre GEMA →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
