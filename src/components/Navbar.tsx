import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageSquare } from 'lucide-react';
import { useChat } from '../context/ChatContext';

// Updated navigation links for new sections
const navLinks = [
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Fit Check', href: '#fit-check' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const ticking = useRef(false);
  const { openChat } = useChat();

  useEffect(() => {
    const handleScroll = () => {
      // Throttle scroll events using requestAnimationFrame
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[--color-background]/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="text-xl font-bold text-[--color-teal] hover:opacity-80 transition-opacity"
          >
            RS
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[--color-text-primary] hover:text-[--color-teal] transition-colors duration-200 text-sm font-medium"
              >
                {link.name}
              </a>
            ))}

            {/* Chat Button */}
            <button
              onClick={openChat}
              className="flex items-center gap-2 px-4 py-2 bg-[--color-teal]/10 border border-[--color-teal]/30 rounded-lg text-[--color-teal] text-sm font-medium hover:bg-[--color-teal]/20 transition-colors"
            >
              <MessageSquare size={16} />
              Ask AI
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[--color-text-primary] hover:text-[--color-teal] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-[--color-text-primary] hover:text-[--color-teal] transition-colors duration-200 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}

                {/* Mobile Chat Button */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openChat();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[--color-teal]/10 border border-[--color-teal]/30 rounded-lg text-[--color-teal] text-sm font-medium w-fit"
                >
                  <MessageSquare size={16} />
                  Ask AI
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
