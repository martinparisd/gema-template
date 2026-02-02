import type { Section } from '../types';
import { getBackgroundStyle } from '../utils/backgroundColor';

interface VideoSectionProps {
  section: Section;
}

export default function VideoSection({ section }: VideoSectionProps) {
  const sectionContent = section.content || {};
  const title = sectionContent.title || '';
  const url = sectionContent.url || '';
  const provider = sectionContent.provider || 'youtube';

  const bgStyle = getBackgroundStyle(sectionContent.backgroundColor);

  const getEmbedUrl = (videoUrl: string) => {
    if (provider === 'youtube') {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return videoUrl;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <section id={section.id} className={`py-12 ${bgStyle.className}`} style={bgStyle.style}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              {title}
            </h2>
          )}
          <div className="relative rounded-lg overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={embedUrl}
              title={title || 'Video'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
