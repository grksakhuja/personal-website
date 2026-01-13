import { motion } from 'framer-motion';

interface SkillIconProps {
  name: string;
  icon: string;
  index: number;
}

// Simple icon mapping using Unicode/emoji or styled divs
const iconMap: Record<string, string> = {
  azure: '☁️',
  aws: '🔶',
  kubernetes: '⎈',
  docker: '🐳',
  terraform: '🏗️',
  argo: '🔄',
  python: '🐍',
  go: '🔷',
  typescript: '📘',
  redis: '🔴',
  postgresql: '🐘',
  istio: '🌐',
  git: '📦',
  linux: '🐧',
  helm: '⛵',
  prometheus: '🔥',
};

export default function SkillIcon({ name, icon, index }: SkillIconProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: 'easeOut',
      }}
      whileHover={{
        scale: 1.1,
        y: -5,
      }}
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#00d4ff]/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.2)] transition-all duration-300 cursor-default"
    >
      <span className="text-3xl" role="img" aria-label={name}>
        {iconMap[icon] || '💻'}
      </span>
      <span className="text-sm text-[#e5e5e5] font-medium">{name}</span>
    </motion.div>
  );
}
