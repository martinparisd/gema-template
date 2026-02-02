import { Heart, MapPin, Phone, Mail, Instagram } from 'lucide-react';
import type { Section, MedicalGroupWebsite } from '../types';

interface FooterSectionProps {
  section: Section;
  website: MedicalGroupWebsite;
}

export default function FooterSection({ section, website }: FooterSectionProps) {
  const sectionContent = section.content || {};
  const description = sectionContent.description || 'Comprometidos con brindar atención de excelencia en oncología con un equipo especializado y tecnología de vanguardia.';

  const contact = website.website?.contact || {};
  const socials = website.website?.socials || {};
  const schedule = website.website?.schedule || [];
  const addresses = website.group?.addresses;
  const addressList = Array.isArray(addresses) ? addresses : [];
  const primaryAddress = addressList.find((addr: any) => addr.is_primary) || addressList[0] || null;

  return (
    <footer id={section.id} className="bg-[#1a2332] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-red-500" size={32} fill="currentColor" />
              <div>
                <h3 className="text-2xl font-bold">{website.group.name.toLowerCase()}</h3>
                <p className="text-sm text-gray-400">{website.medical_group_name}</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {description}
            </p>

            <div>
              <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
              <div className="flex gap-3">
                {socials.instagram && (
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-full flex items-center justify-center hover:scale-110 transition"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                {socials.facebook && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {socials.twitter && (
                  <a
                    href={socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:scale-110 transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Contacto</h4>
            <div className="space-y-4">
              {addressList.length > 0 ? (
                <div className="space-y-3">
                  {addressList.map((addr: any, index: number) => (
                    <div key={index} className="space-y-2">
                      {addr.label && (
                        <div className="text-xs font-semibold text-white/50 uppercase tracking-wide">
                          {addr.label}
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-white/60 mt-1 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">
                          {addr.street}, {addr.city}, {addr.province} {addr.postal_code}
                        </span>
                      </div>
                      {addr.phone && (
                        <div className="flex items-center gap-3 ml-7">
                          <Phone size={16} className="text-white/60 flex-shrink-0" />
                          <a href={`tel:${addr.phone}`} className="text-gray-300 text-sm hover:text-white transition">
                            {addr.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {contact.address && (
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-white/60 mt-1 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{contact.address}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={20} className="text-white/60 flex-shrink-0" />
                      <a href={`tel:${contact.phone}`} className="text-gray-300 text-sm hover:text-white transition">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                </>
              )}
              {contact.email && (
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-white/60 flex-shrink-0" />
                  <a href={`mailto:${contact.email}`} className="text-gray-300 text-sm hover:text-white transition">
                    {contact.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Horarios de Atención</h4>
            <div className="space-y-3">
              {schedule.length > 0 ? (
                schedule.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{item.day || item.days}:</span>
                    <span className="text-white font-medium">{item.hours || item.time}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Lunes a Viernes:</span>
                    <span className="text-white font-medium">16:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Sábado:</span>
                    <span className="text-white font-medium">09:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Domingo:</span>
                    <span className="text-white font-medium">Cerrado</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
