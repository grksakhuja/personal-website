import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import SkillIcon from '../components/SkillIcon';
import { skillCategories } from '../data/portfolio';

export default function Skills() {
  let globalIndex = 0;

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

        {/* Categorized Skills */}
        <div className="space-y-10">
          {skillCategories.map((category, catIndex) => {
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-sm font-semibold text-[#00d4ff] uppercase tracking-wider">
                    {category.name}
                  </h3>
                  <div className="flex-1 h-px bg-[#2a2a2a]" />
                </div>

                {/* Skills in category */}
                <div className="flex flex-wrap justify-center gap-4">
                  {category.skills.map((skill) => {
                    const index = globalIndex++;
                    return (
                      <SkillIcon
                        key={skill.name}
                        name={skill.name}
                        icon={skill.icon}
                        index={index}
                      />
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
