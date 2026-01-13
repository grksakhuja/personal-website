import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import Hero3D from '../components/Hero3D';
import { personalInfo } from '../data/portfolio';

export default function Hero() {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing animation
  useEffect(() => {
    const tagline = personalInfo.taglines[currentTagline];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < tagline.length) {
            setDisplayText(tagline.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentTagline((prev) => (prev + 1) % personalInfo.taglines.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTagline]);

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
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1 text-center md:text-left"
        >
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#00d4ff] font-mono text-sm mb-4"
          >
            Hello, I'm
          </motion.p>

          {/* Name */}
          <h1 className="text-4xl md:text-6xl font-bold text-[#e5e5e5] mb-4">
            {personalInfo.name}
          </h1>

          {/* Typing Effect */}
          <div className="h-10 mb-6">
            <span className="text-xl md:text-2xl text-[#737373]">
              {displayText}
              <span className="animate-pulse text-[#00d4ff]">|</span>
            </span>
          </div>

          {/* Bio */}
          <p className="text-[#737373] max-w-lg mb-8 leading-relaxed">
            {personalInfo.bio}
          </p>

          {/* CTA Button */}
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-3 rounded-full bg-[#00d4ff] text-[#0a0a0a] font-semibold hover:bg-[#00d4ff]/90 transition-colors shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]"
          >
            View My Work
          </motion.a>
        </motion.div>

        {/* 3D Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="flex-shrink-0"
        >
          <Hero3D />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[#737373]"
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.div>
    </section>
  );
}
