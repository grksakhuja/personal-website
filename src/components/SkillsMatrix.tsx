import { techIcons, techIconColors } from './icons/TechIcons';
import { useMobileDetection } from '../hooks/useMobileDetection';

interface Skill {
  name: string;
  icon?: string;
  proficiency: 'strong' | 'moderate' | 'gap';
}

interface SkillsMatrixProps {
  skills: Skill[];
}

// Proficiency styling
const proficiencyStyles = {
  strong: {
    badge: 'skill-badge-strong',
    label: 'Strong',
    description: 'Daily use, deep expertise',
    headerClass: 'text-[--color-skill-strong]',
  },
  moderate: {
    badge: 'skill-badge-moderate',
    label: 'Moderate',
    description: 'Competent, used regularly',
    headerClass: 'text-[--color-text-primary]',
  },
  gap: {
    badge: 'skill-badge-gap',
    label: 'Gaps',
    description: 'Limited or no experience',
    headerClass: 'text-[--color-skill-gap]',
  },
};

function SkillBadge({ skill, isMobile }: { skill: Skill; isMobile: boolean }) {
  const Icon = skill.icon ? techIcons[skill.icon] : null;
  const iconColor = skill.icon ? techIconColors[skill.icon] : undefined;
  const style = proficiencyStyles[skill.proficiency];

  return (
    <div
      className={`${style.badge} inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm`}
    >
      {Icon && !isMobile && (
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: iconColor }} />
      )}
      <span>{skill.name}</span>
    </div>
  );
}

function SkillColumn({
  proficiency,
  skills,
  isMobile,
}: {
  proficiency: 'strong' | 'moderate' | 'gap';
  skills: Skill[];
  isMobile: boolean;
}) {
  const style = proficiencyStyles[proficiency];

  return (
    <div className="flex-1 min-w-0">
      {/* Column header */}
      <div className="mb-4">
        <h3 className={`font-semibold ${style.headerClass}`}>{style.label}</h3>
        <p className="text-xs text-[--color-text-muted]">{style.description}</p>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillBadge key={skill.name} skill={skill} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

export default function SkillsMatrix({ skills }: SkillsMatrixProps) {
  const { isMobile } = useMobileDetection();

  // Group skills by proficiency
  const strongSkills = skills.filter((s) => s.proficiency === 'strong');
  const moderateSkills = skills.filter((s) => s.proficiency === 'moderate');
  const gapSkills = skills.filter((s) => s.proficiency === 'gap');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <SkillColumn
        proficiency="strong"
        skills={strongSkills}
        isMobile={isMobile}
      />
      <SkillColumn
        proficiency="moderate"
        skills={moderateSkills}
        isMobile={isMobile}
      />
      <SkillColumn
        proficiency="gap"
        skills={gapSkills}
        isMobile={isMobile}
      />
    </div>
  );
}
