import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import type { Section, MedicalGroupWebsite } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface ContactSectionProps {
  section: Section;
  website: MedicalGroupWebsite;
}

const extractTextFromContent = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value.text || value.label || value.title || value.description || '';
  }
  return '';
};

export default function ContactSection({ section, website }: ContactSectionProps) {
  const contact = website.website?.contact;
  const addresses = website.group?.addresses;
  const sectionContent = section.content || {};
  const title = extractTextFromContent(sectionContent.title) || extractTextFromContent(sectionContent) || 'Contacto';
  const subtitle = extractTextFromContent(sectionContent.subtitle) || extractTextFromContent(sectionContent.description) || '';

  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor || '#0d9488');

  const addressList = Array.isArray(addresses) ? addresses : [];
  const primaryAddress = addressList.find((addr: any) => addr.is_primary) || addressList[0] || null;

  const formatAddress = (addr: any) => {
    if (!addr) return null;
    return `${addr.street}, ${addr.city}, ${addr.province} ${addr.postal_code}`;
  };

  const primaryFullAddress = formatAddress(primaryAddress) || contact?.address || null;

  const getMapUrl = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}&zoom=15`;
  };

  return (
    <section id={section.id} className={`py-12 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {title && (
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">{title}</h2>
              {subtitle && <p className="text-lg opacity-80 max-w-2xl mx-auto">{subtitle}</p>}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {primaryFullAddress ? (
                <iframe
                  src={getMapUrl(primaryFullAddress)}
                  className="w-full h-full min-h-[500px]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación del centro médico"
                />
              ) : (
                <div className="w-full h-full min-h-[500px] bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin size={48} className="mx-auto mb-2" />
                    <p>Mapa no disponible</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-primary text-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-2">
                Información de Contacto
              </h2>
              <p className="text-white/90 mb-6">
                Estamos aquí para ayudarte. Contáctanos por cualquiera de estos medios.
              </p>

              <div className="space-y-6">
                {addressList.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <MapPin size={20} />
                      </div>
                      <h4 className="font-semibold text-lg">
                        {addressList.length > 1 ? 'Nuestras Ubicaciones' : 'Ubicación'}
                      </h4>
                    </div>
                    <div className="space-y-4 ml-13">
                      {addressList.map((addr: any, index: number) => {
                        const fullAddr = formatAddress(addr);
                        return (
                          <div key={index} className="border-l-2 border-white/20 pl-4">
                            {addr.label && (
                              <div className="font-semibold text-sm uppercase tracking-wide mb-1 opacity-90">
                                {addr.label}
                              </div>
                            )}
                            {fullAddr && (
                              <p className="text-white/90 mb-2">{fullAddr}</p>
                            )}
                            {addr.phone && (
                              <a
                                href={`tel:${addr.phone}`}
                                className="text-white/90 hover:text-white transition inline-flex items-center gap-2 text-sm"
                              >
                                <Phone size={14} />
                                {addr.phone}
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {contact?.email && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <a href={`mailto:${contact.email}`} className="text-white/90 hover:text-white transition">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Horarios de Atención</h4>
                    <p className="text-white/90 text-sm">Lunes a Viernes: 16:00 - 20:00</p>
                    <p className="text-white/90 text-sm">Sábado: 09:00 - 13:00</p>
                  </div>
                </div>

                {primaryFullAddress && (
                  <div className="pt-4">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(primaryFullAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-white hover:text-white/90 transition font-semibold"
                    >
                      Ver en Google Maps →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
