import AnimatedSection from '../components/AnimatedSection';
import SocialIcon from '../components/SocialIcon';
import ViewCounter from '../components/ViewCounter';
import { socialLinks, getEmail } from '../data/portfolio';

export default function Contact() {
  const allLinks = [
    ...socialLinks,
    { name: 'Email', url: `mailto:${getEmail()}`, icon: 'mail' },
  ];

  return (
    <section id="contact" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection>
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[--color-text-primary] mb-4">
              Get In <span className="text-[--color-cyan]">Touch</span>
            </h2>
            <p className="text-[#737373] max-w-2xl mx-auto">
              Feel free to reach out for opportunities, collaborations, or just to say hello!
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#00d4ff] to-[#a855f7] mx-auto rounded-full mt-4" />
          </div>
        </AnimatedSection>

        {/* Social Links */}
        <div className="flex justify-center gap-8">
          {allLinks.map((link, index) => (
            <SocialIcon
              key={link.name}
              name={link.name}
              url={link.url}
              icon={link.icon}
              index={index}
            />
          ))}
        </div>

        {/* Footer */}
        <AnimatedSection delay={0.5}>
          <div className="mt-16 text-center">
            <p className="text-[#737373] text-sm">
              Designed & Built by{' '}
              <span className="text-[#00d4ff]">Rohit Sakhuja</span>
            </p>
            <p className="text-[#4a4a4a] text-xs mt-2">
              {new Date().getFullYear()} &copy; All rights reserved
            </p>
            <div className="mt-4 flex justify-center">
              <ViewCounter />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
