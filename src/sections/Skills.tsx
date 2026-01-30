import AnimatedSection from '../components/AnimatedSection';
import SkillsMatrix from '../components/SkillsMatrix';

// Skills data with proficiency levels
// This will eventually come from the database
const skillsData = [
  // Strong skills (teal)
  { name: 'Azure', icon: 'azure', proficiency: 'strong' as const },
  { name: 'Kubernetes', icon: 'kubernetes', proficiency: 'strong' as const },
  { name: 'Terraform', icon: 'terraform', proficiency: 'strong' as const },
  { name: 'Docker', icon: 'docker', proficiency: 'strong' as const },
  { name: 'Argo CD', icon: 'argo', proficiency: 'strong' as const },
  { name: 'GitHub Actions', icon: 'githubactions', proficiency: 'strong' as const },
  { name: 'Prometheus', icon: 'prometheus', proficiency: 'strong' as const },
  { name: 'Grafana', icon: 'grafana', proficiency: 'strong' as const },
  { name: 'Linux', icon: 'linux', proficiency: 'strong' as const },
  { name: 'Git', icon: 'git', proficiency: 'strong' as const },
  { name: 'Bash', icon: 'bash', proficiency: 'strong' as const },

  // Moderate skills (gray)
  { name: 'AWS', icon: 'aws', proficiency: 'moderate' as const },
  { name: 'Helm', icon: 'helm', proficiency: 'moderate' as const },
  { name: 'Kustomize', icon: 'kustomize', proficiency: 'moderate' as const },
  { name: 'Flux', icon: 'flux', proficiency: 'moderate' as const },
  { name: 'GitLab CI', icon: 'gitlab', proficiency: 'moderate' as const },
  { name: 'Jenkins', icon: 'jenkins', proficiency: 'moderate' as const },
  { name: 'Python', icon: 'python', proficiency: 'moderate' as const },
  { name: 'Go', icon: 'go', proficiency: 'moderate' as const },
  { name: 'TypeScript', icon: 'typescript', proficiency: 'moderate' as const },
  { name: 'PostgreSQL', icon: 'postgresql', proficiency: 'moderate' as const },
  { name: 'Redis', icon: 'redis', proficiency: 'moderate' as const },
  { name: 'Istio', icon: 'istio', proficiency: 'moderate' as const },
  { name: 'Vault', icon: 'vault', proficiency: 'moderate' as const },
  { name: 'Loki', icon: 'loki', proficiency: 'moderate' as const },

  // Gap skills (amber)
  { name: 'React Native', icon: 'react', proficiency: 'gap' as const },
  { name: 'Machine Learning', icon: 'python', proficiency: 'gap' as const },
  { name: 'Data Science', icon: 'python', proficiency: 'gap' as const },
  { name: 'Mobile Dev', icon: 'react', proficiency: 'gap' as const },
  { name: 'Java', icon: 'java', proficiency: 'gap' as const },
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-4 bg-[--color-surface]">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[--color-text-primary] mb-4">
              Skills Self-Assessment
            </h2>
            <p className="text-[--color-text-muted] text-lg max-w-2xl mx-auto">
              Honest assessment of where I'm strong, where I'm competent, and where I have gaps.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#00d4ff] to-[#a855f7] mx-auto rounded-full mt-4" />
          </div>

          {/* Skills Matrix */}
          <SkillsMatrix skills={skillsData} />
        </AnimatedSection>
      </div>
    </section>
  );
}
