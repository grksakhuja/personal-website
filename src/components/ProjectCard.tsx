import { motion } from 'framer-motion';
import { ExternalLink, Code, Star } from 'lucide-react';
import { useMobileDetection } from '../hooks/useMobileDetection';

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  liveUrl: string | null;
  index: number;
  featured?: boolean;
}

export default function ProjectCard({
  title,
  description,
  tech,
  liveUrl,
  index,
  featured = false,
}: ProjectCardProps) {
  const { isMobile } = useMobileDetection();

  const cardContent = (
    <>
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-teal)]/10 border border-[var(--color-teal)]/30">
          <Star size={12} className="text-[var(--color-teal)]" fill="var(--color-teal)" />
          <span className="text-xs text-[var(--color-teal)] font-medium">Featured</span>
        </div>
      )}

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-teal)]/5 to-[var(--color-cyan)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className={`relative ${featured ? 'p-8' : 'p-6'}`}>
        {/* Icon */}
        <div className={`${featured ? 'w-14 h-14' : 'w-12 h-12'} rounded-lg bg-[var(--color-teal)]/10 flex items-center justify-center mb-4`}>
          <Code className="text-[var(--color-teal)]" size={featured ? 28 : 24} />
        </div>

        {/* Title */}
        <h3 className={`${featured ? 'text-2xl' : 'text-xl'} font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-teal)] transition-colors duration-300`}>
          {title}
        </h3>

        {/* Description */}
        <p className={`text-[var(--color-text-muted)] ${featured ? 'text-base' : 'text-sm'} leading-relaxed mb-4`}>
          {description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tech.map((t) => (
            <span
              key={t}
              className="px-2 py-1 text-xs rounded-full bg-[var(--color-background)] text-[var(--color-teal)] border border-[var(--color-teal)]/20"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Link */}
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-teal)] hover:text-[var(--color-teal)]/80 transition-colors"
          >
            <span>View Live</span>
            <ExternalLink size={14} />
          </a>
        )}
        {!liveUrl && (
          <span className="text-sm text-[var(--color-text-muted)] italic">
            Internal project
          </span>
        )}
      </div>
    </>
  );

  // On mobile, render without animation
  if (isMobile) {
    return (
      <div className="group relative bg-[var(--color-surface)] rounded-xl border border-white/[0.08] overflow-hidden backdrop-blur-sm">
        {cardContent}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{ y: -5 }}
      className="group relative bg-[var(--color-surface)] rounded-xl border border-white/[0.08] overflow-hidden hover:border-[var(--color-teal)]/50 hover:shadow-[0_0_30px_rgba(74,222,128,0.15)] transition-all duration-300 backdrop-blur-sm"
    >
      {cardContent}
    </motion.div>
  );
}
