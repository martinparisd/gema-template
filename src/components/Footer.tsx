import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import type { MedicalGroupWebsite } from '../types';

interface FooterProps {
  website: MedicalGroupWebsite;
}

export default function Footer({ website }: FooterProps) {
  const socials = website.website?.socials;

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {socials && (Object.values(socials).some(v => v)) && (
            <div className="flex justify-center gap-6 mb-6">
              {socials.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
              )}
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-sky-500 rounded-full flex items-center justify-center transition"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
              )}
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              )}
              {socials.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition"
                  aria-label="YouTube"
                >
                  <Youtube size={20} />
                </a>
              )}
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} {website.medical_group_name}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
