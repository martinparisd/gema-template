import { MapPin, Phone, Clock } from 'lucide-react';
import type { Section, MedicalGroupWebsite } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface MapSectionProps {
  section: Section;
  website: MedicalGroupWebsite;
}

interface Address {
  id?: string;
  street: string;
  city: string;
  state?: string;
  zip_code?: string;
  country?: string;
  phone?: string;
  lat?: number;
  lng?: number;
  is_primary?: boolean;
  name?: string;
  schedule?: string;
}

export default function MapSection({ section, website }: MapSectionProps) {
  const sectionContent = section.content || {};
  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor);

  const addresses = website.group?.addresses;
  const addressList: Address[] = Array.isArray(addresses) ? addresses : [];

  const title = sectionContent.title || 'Nuestras Ubicaciones';
  const subtitle = sectionContent.subtitle || 'Encuentre la sucursal más cercana a usted';

  return (
    <section id={section.id} className={`py-16 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-gray-600">
                {subtitle}
              </p>
            )}
          </div>

          {addressList.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {addressList.map((address, index) => (
                <div
                  key={address.id || index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                    {address.lat && address.lng ? (
                      <iframe
                        src={`https://maps.google.com/maps?q=${address.lat},${address.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        className="absolute inset-0 w-full h-full border-0"
                        loading="lazy"
                        title={`Mapa de ${address.name || address.street}`}
                        aria-label={`Mapa mostrando la ubicación de ${address.name || address.street}`}
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <MapPin size={48} className="mx-auto mb-2" />
                        <p className="text-sm">Mapa no disponible</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {address.name && (
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {address.name}
                      </h3>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-primary mt-0.5 flex-shrink-0" />
                        <div className="text-gray-700">
                          <p className="font-medium">{address.street}</p>
                          <p>
                            {address.city}
                            {address.state && `, ${address.state}`}
                            {address.zip_code && ` ${address.zip_code}`}
                          </p>
                          {address.country && <p>{address.country}</p>}
                        </div>
                      </div>

                      {address.phone && (
                        <div className="flex items-center gap-3">
                          <Phone size={20} className="text-primary flex-shrink-0" />
                          <a
                            href={`tel:${address.phone}`}
                            className="text-gray-700 hover:text-primary transition"
                          >
                            {address.phone}
                          </a>
                        </div>
                      )}

                      {address.schedule && (
                        <div className="flex items-start gap-3">
                          <Clock size={20} className="text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm">{address.schedule}</p>
                        </div>
                      )}

                      {address.lat && address.lng && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${address.lat},${address.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:text-secondary font-medium transition mt-4"
                        >
                          <MapPin size={16} />
                          Ver en Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <MapPin size={64} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-600">
                No hay ubicaciones disponibles en este momento
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
