import AnimatedSection from '../components/AnimatedSection';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/portfolio';

export default function Projects() {
  const featuredProject = projects.find((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#e5e5e5] mb-4">
              Featured <span className="text-[#00d4ff]">Projects</span>
            </h2>
            <p className="text-[#737373] max-w-2xl mx-auto">
              A selection of projects I've worked on
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#00d4ff] to-[#a855f7] mx-auto rounded-full mt-4" />
          </div>
        </AnimatedSection>

        {/* Featured Project - Full Width */}
        {featuredProject && (
          <div className="mb-6">
            <ProjectCard
              title={featuredProject.title}
              description={featuredProject.description}
              tech={featuredProject.tech}
              liveUrl={featuredProject.liveUrl}
              index={0}
              featured={true}
            />
          </div>
        )}

        {/* Other Projects - 2 Column Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {otherProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              tech={project.tech}
              liveUrl={project.liveUrl}
              index={index + 1}
              featured={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
