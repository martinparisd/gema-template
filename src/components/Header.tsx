import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { MedicalGroupWebsite, Section } from '../types';

interface HeaderProps {
  website: MedicalGroupWebsite;
  onNavigate: (sectionId: string) => void;
}

const getSectionLabel = (section: Section): string => {
  const typeLabels: Record<string, string> = {
    hero: 'Home',
    services: 'Nuestro Servicios',
    about: 'Sobre Nosotros',
    booking: 'Turnos',
  };

  return typeLabels[section.type] || section.type;
};

export default function Header({ website, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allowedTypes = ['hero', 'services', 'about', 'booking'];
  const typeOrder = { hero: 0, services: 1, about: 2, booking: 3 };

  const mainSections = website.sections
    .filter(s => s.is_visible && allowedTypes.includes(s.type))
    .sort((a, b) => (typeOrder[a.type as keyof typeof typeOrder] || 999) - (typeOrder[b.type as keyof typeof typeOrder] || 999));

  const handleNavigate = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };


  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {website.logo_url && (
              <img
                src={website.logo_url}
                alt={website.medical_group_name}
                className="h-12 w-auto object-contain"
              />
            )}
            <div className="flex items-center gap-3">
              <Heart className="text-red-500 animate-heartbeat" size={28} fill="currentColor" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {website.medical_group_name}
              </h1>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            {mainSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavigate(section.id)}
                className="text-gray-700 hover:text-primary font-medium transition"
              >
                {getSectionLabel(section)}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-gray-900 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {mainSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavigate(section.id)}
                className="text-left text-gray-700 hover:text-primary font-medium transition py-2"
              >
                {getSectionLabel(section)}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
