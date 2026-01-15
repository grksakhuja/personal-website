import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ExternalLink, Code, Star } from 'lucide-react';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth < 768 || /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsMobile(mobile);
  }, []);

  const cardContent = (
    <>
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30">
          <Star size={12} className="text-[#00d4ff]" fill="#00d4ff" />
          <span className="text-xs text-[#00d4ff] font-medium">Featured</span>
        </div>
      )}

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/5 to-[#a855f7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className={`relative ${featured ? 'p-8' : 'p-6'}`}>
        {/* Icon */}
        <div className={`${featured ? 'w-14 h-14' : 'w-12 h-12'} rounded-lg bg-[#00d4ff]/10 flex items-center justify-center mb-4`}>
          <Code className="text-[#00d4ff]" size={featured ? 28 : 24} />
        </div>

        {/* Title */}
        <h3 className={`${featured ? 'text-2xl' : 'text-xl'} font-bold text-[#e5e5e5] mb-2 group-hover:text-[#00d4ff] transition-colors duration-300`}>
          {title}
        </h3>

        {/* Description */}
        <p className={`text-[#737373] ${featured ? 'text-base' : 'text-sm'} leading-relaxed mb-4`}>
          {description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tech.map((t) => (
            <span
              key={t}
              className="px-2 py-1 text-xs rounded-full bg-[#0a0a0a] text-[#00d4ff] border border-[#00d4ff]/20"
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
            className="inline-flex items-center gap-2 text-sm text-[#00d4ff] hover:text-[#00d4ff]/80 transition-colors"
          >
            <span>View Live</span>
            <ExternalLink size={14} />
          </a>
        )}
        {!liveUrl && (
          <span className="text-sm text-[#737373] italic">
            Internal project
          </span>
        )}
      </div>
    </>
  );

  // On mobile, render without animation
  if (isMobile) {
    return (
      <div className="group relative bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
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
      className="group relative bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden hover:border-[#00d4ff]/50 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] transition-all duration-300"
    >
      {cardContent}
    </motion.div>
  );
}
