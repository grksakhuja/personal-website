import { motion } from 'framer-motion';
import { techIcons, techIconColors } from './icons/TechIcons';

interface SkillIconProps {
  name: string;
  icon: string;
  index: number;
}

export default function SkillIcon({ name, icon, index }: SkillIconProps) {
  const IconComponent = techIcons[icon];
  const color = techIconColors[icon] || '#e5e5e5';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.2,
        delay: Math.min(index * 0.02, 0.3), // Faster fade, capped delay
        ease: 'easeOut',
      }}
      whileHover={{
        scale: 1.1,
        y: -5,
      }}
      className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#00d4ff]/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.2)] transition-all duration-300 cursor-default"
    >
      {IconComponent ? (
        <IconComponent size={36} color={color} />
      ) : (
        <span className="text-3xl">💻</span>
      )}
      <span className="text-sm text-[#e5e5e5] font-medium">{name}</span>
    </motion.div>
  );
}
