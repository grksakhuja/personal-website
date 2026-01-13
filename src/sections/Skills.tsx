import AnimatedSection from '../components/AnimatedSection';
import SkillIcon from '../components/SkillIcon';
import { skills } from '../data/portfolio';

export default function Skills() {
  return (
    <section id="skills" className="py-24 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#e5e5e5] mb-4">
              Tech <span className="text-[#00d4ff]">Stack</span>
            </h2>
            <p className="text-[#737373] max-w-2xl mx-auto">
              Technologies and tools I use to build scalable, reliable infrastructure
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#00d4ff] to-[#a855f7] mx-auto rounded-full mt-4" />
          </div>
        </AnimatedSection>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {skills.map((skill, index) => (
            <SkillIcon
              key={skill.name}
              name={skill.name}
              icon={skill.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
