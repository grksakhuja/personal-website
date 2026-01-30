import { motion } from 'framer-motion';
import { MapPin, Calendar, Award } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { personalInfo } from '../data/portfolio';

export default function About() {
  const highlights = [
    { icon: Calendar, text: '10+ Years Experience' },
    { icon: MapPin, text: personalInfo.location },
    { icon: Award, text: 'Platform & DevOps Focus' },
  ];

  return (
    <section id="about" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[--color-text-primary] mb-4">
              About <span className="text-[--color-cyan]">Me</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#00d4ff] to-[#a855f7] mx-auto rounded-full" />
          </div>
        </AnimatedSection>

        {/* Text Content */}
        <AnimatedSection delay={0.2}>
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-[#e5e5e5] mb-4">
              Platform Engineer & Cloud Architect
            </h3>
            <p className="text-[#737373] leading-relaxed mb-6">
              I'm a passionate Platform Engineer with over a decade of experience
              designing and implementing scalable cloud infrastructure. I specialize
              in GitOps methodologies, Kubernetes orchestration, and building
              developer-friendly platforms that enable teams to ship faster.
            </p>
            <p className="text-[#737373] leading-relaxed mb-8">
              My work focuses on automation, reliability, and creating self-service
              infrastructure that empowers development teams to move fast without
              compromising on security or stability.
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap justify-center gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]"
                >
                  <item.icon size={16} className="text-[#00d4ff]" />
                  <span className="text-sm text-[#e5e5e5]">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
