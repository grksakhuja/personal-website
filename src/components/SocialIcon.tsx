import { motion } from 'framer-motion';
import { Linkedin, Github, Mail } from 'lucide-react';

interface SocialIconProps {
  name: string;
  url: string;
  icon: string;
  index: number;
}

const iconComponents: Record<string, React.ComponentType<{ size: number }>> = {
  linkedin: Linkedin,
  github: Github,
  mail: Mail,
};

export default function SocialIcon({ name, url, icon, index }: SocialIconProps) {
  const IconComponent = iconComponents[icon] || Mail;

  return (
    <motion.a
      href={url}
      target={icon === 'mail' ? undefined : '_blank'}
      rel={icon === 'mail' ? undefined : 'noopener noreferrer'}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{
        scale: 1.1,
        y: -3,
      }}
      className="group flex flex-col items-center gap-2"
      aria-label={name}
    >
      <div className="w-14 h-14 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center group-hover:border-[#00d4ff] group-hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all duration-300">
        <IconComponent size={24} />
      </div>
      <span className="text-xs text-[#737373] group-hover:text-[#00d4ff] transition-colors">
        {name}
      </span>
    </motion.a>
  );
}
