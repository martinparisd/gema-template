import { useState, useEffect } from 'react';
import type { MedicalGroupWebsite, Doctor, Service } from './types';
import { getMedicalGroupWebsite } from './services/api';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import DoctorsSection from './components/DoctorsSection';
import InsuranceSection from './components/InsuranceSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import BookingModal from './components/BookingModal';
import LoadingSpinner from './components/LoadingSpinner';
import TextSection from './components/TextSection';
import CardsSection from './components/CardsSection';
import GallerySection from './components/GallerySection';
import VideoSection from './components/VideoSection';
import FacilitiesSection from './components/FacilitiesSection';
import BookingSection from './components/BookingSection';
import CTASection from './components/CTASection';
import BannerSection from './components/BannerSection';
import TestimonialsSection from './components/TestimonialsSection';
import StatsSection from './components/StatsSection';
import ScheduleSection from './components/ScheduleSection';
import MapSection from './components/MapSection';
import FAQSection from './components/FAQSection';
import DividerSection from './components/DividerSection';
import FooterSection from './components/FooterSection';
import GEMASection from './components/GEMASection';

function App() {
  const [website, setWebsite] = useState<MedicalGroupWebsite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preSelectedDoctor, setPreSelectedDoctor] = useState<Doctor | undefined>();
  const [preSelectedService, setPreSelectedService] = useState<Service | undefined>();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    console.log('[App] Extracting slug from URL');
    const pathname = window.location.pathname;
    console.log('[App] pathname:', pathname);
    const extractedSlug = pathname.replace(/^\/+|\/+$/g, '');
    console.log('[App] extractedSlug:', extractedSlug);

    if (!extractedSlug) {
      console.log('[App] No slug found in URL');
      setError('Please provide a medical group identifier in the URL (e.g., /gao)');
      setLoading(false);
      return;
    }

    console.log('[App] Setting slug:', extractedSlug);
    setSlug(extractedSlug);
  }, []);

  useEffect(() => {
    console.log('[App] Slug changed, current slug:', slug);
    if (slug) {
      console.log('[App] Triggering loadWebsiteData');
      loadWebsiteData();
    }
  }, [slug]);

  useEffect(() => {
    console.log('[App] Website changed, applying theme and SEO. Website:', website);
    if (website) {
      if (website.theme) {
        console.log('[App] Applying theme:', website.theme);
        applyTheme(website.theme);
      }
      if (website.website?.seo) {
        console.log('[App] Applying SEO metadata:', website.website.seo);
        applySEO(website.website.seo, website.medical_group_name);
      }
    }
  }, [website]);

  const loadWebsiteData = async () => {
    console.log('[App] loadWebsiteData called with slug:', slug);
    if (!slug) {
      console.log('[App] No slug, returning early');
      return;
    }

    try {
      console.log('[App] Starting to load website data');
      setLoading(true);
      setError(null);
      console.log('[App] Calling getMedicalGroupWebsite with slug:', slug);
      const data = await getMedicalGroupWebsite(slug);
      console.log('[App] Received website data:', data);
      setWebsite(data);
      console.log('[App] Website state updated successfully');
    } catch (err) {
      console.error('[App] Error loading website data:', err);
      setError('Medical group not found. Please check the URL and try again.');
    } finally {
      console.log('[App] Setting loading to false');
      setLoading(false);
    }
  };

  const applyTheme = (theme: MedicalGroupWebsite['theme']) => {
    const root = document.documentElement;

    const primaryColor = theme.colors?.primary || theme.primary_color || '#14b8a6';
    const secondaryColor = theme.colors?.secondary || theme.secondary_color || '#0f766e';
    const fontFamily = theme.font?.family || theme.font_family;
    const headingsFont = theme.font?.headings;
    const borderRadius = theme.borderRadius;

    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--secondary-color', secondaryColor);

    if (fontFamily) {
      loadGoogleFont(fontFamily);
      root.style.setProperty('--font-family', `'${fontFamily}', system-ui, -apple-system, sans-serif`);
    }

    if (headingsFont) {
      if (headingsFont !== fontFamily) {
        loadGoogleFont(headingsFont);
      }
      root.style.setProperty('--headings-font', `'${headingsFont}', system-ui, -apple-system, sans-serif`);
    } else if (fontFamily) {
      root.style.setProperty('--headings-font', `'${fontFamily}', system-ui, -apple-system, sans-serif`);
    }

    if (borderRadius) {
      const radiusMap: Record<string, string> = {
        'none': '0',
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        'full': '9999px'
      };
      root.style.setProperty('--border-radius', radiusMap[borderRadius] || radiusMap['md']);
    }
  };

  const loadGoogleFont = (fontName: string) => {
    const fontId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;

    if (document.getElementById(fontId)) {
      return;
    }

    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
  };

  const applySEO = (seo: NonNullable<MedicalGroupWebsite['website']>['seo'], groupName: string) => {
    if (!seo) return;

    document.title = seo.title || `${groupName} - Centro Médico`;

    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    if (seo.description) {
      setMetaTag('description', seo.description);
    }

    if (seo.keywords) {
      setMetaTag('keywords', seo.keywords);
    }
  };

  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openBookingModal = (doctor?: Doctor, service?: Service) => {
    setPreSelectedDoctor(doctor);
    setPreSelectedService(service);
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    setPreSelectedDoctor(undefined);
    setPreSelectedService(undefined);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to Load Website
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'An unexpected error occurred'}
          </p>
          <button
            onClick={loadWebsiteData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const visibleSections = website.sections
    .filter(s => s.is_visible)
    .sort((a, b) => a.order_index - b.order_index);

  const nonFooterSections = visibleSections.filter(s => s.type !== 'footer');
  const footerSections = visibleSections.filter(s => s.type === 'footer');

  return (
    <div className="min-h-screen bg-white">
      <Header website={website} onNavigate={handleNavigate} />

      <main>
        {nonFooterSections.map((section) => {
          switch (section.type) {
            case 'hero':
              return (
                <HeroSection
                  key={section.id}
                  section={section}
                  onBookAppointment={() => openBookingModal()}
                />
              );
            case 'about':
              return <AboutSection key={section.id} section={section} />;
            case 'services':
              return (
                <ServicesSection
                  key={section.id}
                  section={section}
                  services={website.services}
                  onBookService={(service) => openBookingModal(undefined, service)}
                />
              );
            case 'doctors':
              return (
                <DoctorsSection
                  key={section.id}
                  section={section}
                  doctors={website.doctors}
                  insurance={website.insurance}
                  schedules={website.schedules}
                  onBookDoctor={(doctor) => openBookingModal(doctor)}
                />
              );
            case 'insurance':
              return (
                <InsuranceSection
                  key={section.id}
                  section={section}
                  insurance={website.insurance}
                />
              );
            case 'contact':
              return <ContactSection key={section.id} section={section} website={website} />;
            case 'text':
              return <TextSection key={section.id} section={section} />;
            case 'cards':
              return <CardsSection key={section.id} section={section} />;
            case 'gallery':
              return <GallerySection key={section.id} section={section} />;
            case 'video':
              return <VideoSection key={section.id} section={section} />;
            case 'facilities':
              return <FacilitiesSection key={section.id} section={section} />;
            case 'booking':
              return (
                <BookingSection
                  key={section.id}
                  section={section}
                  slug={slug || ''}
                  doctors={website.doctors}
                  insurance={website.insurance}
                />
              );
            case 'cta':
              return <CTASection key={section.id} section={section} />;
            case 'banner':
              return <BannerSection key={section.id} section={section} />;
            case 'testimonials':
              return <TestimonialsSection key={section.id} section={section} />;
            case 'stats':
              return <StatsSection key={section.id} section={section} />;
            case 'schedule':
              return <ScheduleSection key={section.id} section={section} />;
            case 'map':
              return <MapSection key={section.id} section={section} website={website} />;
            case 'faq':
              return <FAQSection key={section.id} section={section} />;
            case 'divider':
              return <DividerSection key={section.id} section={section} />;
            default:
              console.warn(`Unknown section type: ${section.type}`);
              return null;
          }
        })}
      </main>

      <GEMASection website={website} />

      {footerSections.length > 0 ? (
        footerSections.map((section) => (
          <FooterSection key={section.id} section={section} website={website} />
        ))
      ) : (
        <Footer website={website} />
      )}

      <ChatWidget widgets={website.website?.widgets || null} data={website} slug={slug || ''} />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={closeBookingModal}
        slug={slug || ''}
        medicalGroupId={website.medical_group_id}
        doctors={website.doctors}
        services={website.services}
        preSelectedDoctor={preSelectedDoctor}
        preSelectedService={preSelectedService}
      />
    </div>
  );
}

export default App;
