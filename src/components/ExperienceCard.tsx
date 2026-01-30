import { Calendar, MapPin } from 'lucide-react';
import AIContextPanel from './AIContextPanel';
import { useMobileDetection } from '../hooks/useMobileDetection';

interface ExperienceCardProps {
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  location?: string;
  description?: string;
  highlights?: string[];
  situation?: string;
  approach?: string;
  technicalWork?: string;
  lessonsLearned?: string;
}

export default function ExperienceCard({
  company,
  role,
  startDate,
  endDate,
  location,
  description,
  highlights,
  situation,
  approach,
  technicalWork,
  lessonsLearned,
}: ExperienceCardProps) {
  const { isMobile } = useMobileDetection();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const isCurrent = !endDate;
  const dateRange = `${formatDate(startDate)} - ${endDate ? formatDate(endDate) : 'Present'}`;

  return (
    <div className="experience-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[--color-text-primary]">
            {role}
          </h3>
          <p className="text-[--color-teal] font-medium">
            {company}
            {isCurrent && (
              <span className="ml-2 text-xs bg-[--color-teal]/10 border border-[--color-teal]/30 px-2 py-0.5 rounded-full">
                Current
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 text-sm text-[--color-text-muted] mb-4">
        <span className="flex items-center gap-1.5">
          <Calendar size={14} />
          {dateRange}
        </span>
        {location && (
          <span className="flex items-center gap-1.5">
            <MapPin size={14} />
            {location}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-[--color-text-muted] text-sm leading-relaxed mb-4">
          {description}
        </p>
      )}

      {/* Highlights */}
      {highlights && highlights.length > 0 && (
        <ul className="space-y-2 mb-4">
          {highlights.map((highlight, index) => (
            <li
              key={index}
              className="text-sm text-[--color-text-muted] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-[--color-teal] before:rounded-full"
            >
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {/* AI Context - only show on desktop for detailed info */}
      {!isMobile && (
        <AIContextPanel
          situation={situation}
          approach={approach}
          technicalWork={technicalWork}
          lessonsLearned={lessonsLearned}
        />
      )}
    </div>
  );
}
