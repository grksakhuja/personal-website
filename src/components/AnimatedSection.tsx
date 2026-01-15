import { motion } from 'framer-motion';
import { useState, useEffect, type ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0
}: AnimatedSectionProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Disable animations on mobile to prevent Safari crashes
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    checkMobile();
  }, []);

  // On mobile, render without animation to prevent crashes
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
