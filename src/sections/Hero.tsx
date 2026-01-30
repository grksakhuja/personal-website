import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MessageSquare, Sparkles } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import TerminalAnimation from '../components/TerminalAnimation';
import StatusBadge from '../components/StatusBadge';
import CompanyBadges from '../components/CompanyBadges';
import { useChat } from '../context/ChatContext';
import { personalInfo } from '../data/portfolio';
import { useMobileDetection } from '../hooks/useMobileDetection';

// Isolated typing animation component using requestAnimationFrame for smoother timing
const TypingText = memo(function TypingText({
  taglines,
  isMobile
}: {
  taglines: string[];
  isMobile: boolean;
}) {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (isMobile) return;

    const tagline = taglines[currentTagline];
    const typeDelay = isDeleting ? 50 : 100;
    const pauseDelay = 2000;

    const animate = (timestamp: number) => {
      if (!lastUpdateRef.current) {
        lastUpdateRef.current = timestamp;
      }

      const elapsed = timestamp - lastUpdateRef.current;

      if (!isDeleting) {
        if (displayText.length < tagline.length) {
          if (elapsed >= typeDelay) {
            setDisplayText(tagline.slice(0, displayText.length + 1));
            lastUpdateRef.current = timestamp;
          }
        } else {
          // Finished typing, wait then delete
          if (elapsed >= pauseDelay) {
            setIsDeleting(true);
            lastUpdateRef.current = timestamp;
          }
        }
      } else {
        if (displayText.length > 0) {
          if (elapsed >= typeDelay) {
            setDisplayText(displayText.slice(0, -1));
            lastUpdateRef.current = timestamp;
          }
        } else {
          // Finished deleting, move to next tagline
          setIsDeleting(false);
          setCurrentTagline((prev) => (prev + 1) % taglines.length);
          lastUpdateRef.current = timestamp;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [displayText, isDeleting, currentTagline, isMobile, taglines]);

  return (
    <span className="text-xl md:text-2xl text-[--color-text-muted]">
      {isMobile ? taglines[0] : displayText}
      {!isMobile && <span className="animate-pulse text-[--color-teal]">|</span>}
    </span>
  );
});

export default function Hero() {
  const { isMobile } = useMobileDetection();
  const { openChat } = useChat();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Particle Background */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          {/* Status Badge */}
          {/* SYNC: Values must match migrations/002_seed_profile.sql preferred_roles and preferred_company_stages */}
          <div className="mb-6">
            <StatusBadge
              status="open"
              roles={['Platform Engineer', 'DevOps Lead', 'SRE', 'Cloud Architect']}
              companyStages={['Series A+', 'Growth Stage', 'Scale-up', 'Enterprise']}
            />
          </div>

          {/* Greeting */}
          <p className="text-[--color-teal] text-sm mb-4 tracking-wide">
            Hello, I'm
          </p>

          {/* Name */}
          <h1 className="text-4xl md:text-6xl font-bold text-[--color-text-primary] mb-4">
            {personalInfo.name}
          </h1>

          {/* Typing Effect - isolated to prevent re-renders */}
          <div className="h-10 mb-6">
            <TypingText taglines={personalInfo.taglines} isMobile={isMobile} />
          </div>

          {/* Terminal - shown inline on mobile only, desktop shows it on the right */}
          {isMobile && (
            <div className="mb-6">
              <TerminalAnimation />
            </div>
          )}

          {/* Bio */}
          <p className="text-[--color-text-muted] max-w-lg mb-6 leading-relaxed">
            {personalInfo.bio}
          </p>

          {/* Company Badges */}
          {/* SYNC: Company list must match Experience.tsx - update both files together */}
          <div className="mb-8 md:text-left">
            <p className="text-xs text-[--color-text-muted] mb-2 uppercase tracking-wide">
              Previously at
            </p>
            <CompanyBadges companies={['Drivvn', 'Kainos', 'Sainsbury\'s']} />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            {/* Primary CTA - Ask AI */}
            <button
              onClick={openChat}
              className="cta-button flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} />
              Ask AI About Me
              <span className="new-badge">New</span>
            </button>

            {/* Secondary CTA - Fit Check */}
            <a
              href="#fit-check"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-[--color-text-primary] font-medium hover:border-[--color-teal] hover:text-[--color-teal] transition-colors"
            >
              <Sparkles size={18} />
              Check Fit
            </a>
          </div>
        </div>

        {/* Terminal - shown on right side for desktop only */}
        {!isMobile && (
          <div className="flex-shrink-0">
            <TerminalAnimation />
          </div>
        )}
      </div>

      {/* Scroll indicator - static on mobile */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        {isMobile ? (
          <div className="text-[--color-text-muted]">
            <ChevronDown size={32} />
          </div>
        ) : (
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[--color-text-muted]"
          >
            <ChevronDown size={32} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
