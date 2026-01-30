import AnimatedSection from '../components/AnimatedSection';
import ExperienceCard from '../components/ExperienceCard';
import { useMobileDetection } from '../hooks/useMobileDetection';

// Real experience data from CV
// SYNC: Company names also appear in Hero.tsx CompanyBadges - update both files together
const experiences = [
  {
    id: 1,
    company: 'Drivvn',
    role: 'Senior Platform Engineer',
    start_date: '2021-01-01',
    end_date: '2026-02-01',
    location: 'Fully Remote (UK company, Malaysia-based)',
    description: 'Continuously improving platform engineering capabilities across Azure environments supporting high-traffic EMEA automotive commerce clients.',
    highlights: [
      'Reduced deployment time by 70% through GitOps automation',
      'Achieved 99.9%+ infrastructure uptime across production AKS clusters',
      'Improved incident recovery (MTTR) by 60%',
      'Built self-service infrastructure provisioning platform',
    ],
    situation: 'Joined a UK-based automotive technology company where development teams were bottlenecked by manual infrastructure provisioning and inconsistent deployment processes.',
    approach: 'Designed and implemented a GitOps-driven automated deployment framework integrating Argo CD with a custom developer portal (Port.io). Built self-service infrastructure provisioning.',
    technical_work: 'Architected multi-region Azure infrastructure including AKS clusters, Cosmos DB, MariaDB, MySQL, Azure Cache for Redis, Front Door CDN, and APIM. Developed Go-based tooling for dynamic Terraform configuration generation.',
    lessons_learned: "Self-service doesn't mean self-managed - guardrails and governance controls are essential. Platform teams should make the right way the easy way.",
  },
  {
    id: 2,
    company: 'Kainos Software Limited',
    role: 'Platform Engineer',
    start_date: '2019-03-01',
    end_date: '2021-01-31',
    location: 'Remote (UK Based)',
    description: 'Engineered and maintained infrastructure-as-code solutions across Azure and AWS environments for enterprise client projects.',
    highlights: [
      'Reduced cloud operational costs by 30%',
      'Achieved zero-downtime AKS migrations',
      'Built reusable IaC modules improving deployment consistency',
    ],
    situation: 'Worked with enterprise clients requiring robust CI/CD pipelines and cloud migration support.',
    approach: 'Designed automated CI/CD pipelines with full testing and deployment strategies. Led cloud migration initiatives from Azure App Service to AKS.',
    technical_work: 'Built CI/CD pipelines using Azure DevOps and Jenkins with automated testing and blue-green deployments. Migrated applications to AKS using Terraform ensuring zero downtime.',
    lessons_learned: 'Documentation and runbooks are force multipliers. Automate the toil, but document the decisions.',
  },
  {
    id: 3,
    company: 'Qwert Consulting Limited',
    role: 'Director',
    start_date: '2018-01-01',
    end_date: '2019-03-31',
    location: 'UK',
    description: 'Founded and operated infrastructure consulting practice delivering multi-cloud and on-premise automation solutions.',
    highlights: [
      'Reduced deployment time from days to hours',
      'Delivered multi-cloud automation solutions',
      'Managed customer relationships and technical delivery',
    ],
    situation: 'Clients needed deployment automation across AWS, Azure, and on-premise infrastructure.',
    approach: 'Designed and developed deployment automation tools for distributed systems. Built end-to-end automation for provisioning and configuration.',
    technical_work: 'Built Terraform-based infrastructure automation across AWS, Azure, and on-premise environments. Created deployment automation tools using scripting.',
    lessons_learned: "Change management is as important as technical skills. You can't automate your way around organisational resistance.",
  },
  {
    id: 4,
    company: "JS Sainsbury's PLC",
    role: 'Converged Infrastructure Engineer',
    start_date: '2016-10-01',
    end_date: '2018-01-31',
    location: 'UK (On-site)',
    description: "Provided expert third-line support for Sainsbury's converged infrastructure platform at enterprise scale.",
    highlights: [
      'Provided third-line support for UK retail enterprise',
      'Maintained high availability during peak trading periods',
      'Managed hybrid Windows/Linux virtualised environments',
    ],
    situation: "One of UK's largest retailers required high-availability infrastructure with zero-tolerance for downtime during peak trading periods.",
    approach: 'Leveraged deep technical expertise to diagnose and resolve complex infrastructure issues. Implemented performance tuning and preventive maintenance.',
    technical_work: 'Maintained and optimised virtualisation platforms, storage systems, and network infrastructure at enterprise scale.',
    lessons_learned: 'High-pressure operations build resilience and rapid troubleshooting skills. Enterprise-scale infrastructure requires systematic approaches.',
  },
];

export default function Experience() {
  const { isMobile } = useMobileDetection();

  return (
    <section id="experience" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[--color-text-primary] mb-4">
              Experience
            </h2>
            <p className="text-[--color-text-muted] text-lg max-w-2xl mx-auto">
              A timeline of my professional journey, with context for how I approach problems.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#00d4ff] to-[#a855f7] mx-auto rounded-full mt-4" />
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line - hidden on mobile */}
            {!isMobile && (
              <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
            )}

            {/* Experience cards */}
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div
                  key={exp.id}
                  className={!isMobile ? 'pl-8 relative' : ''}
                >
                  {/* Timeline dot - hidden on mobile */}
                  {!isMobile && (
                    <div className="absolute left-0 top-6 w-2 h-2 rounded-full bg-[--color-teal] -translate-x-1/2" />
                  )}

                  <AnimatedSection delay={index * 0.1}>
                    <ExperienceCard
                      company={exp.company}
                      role={exp.role}
                      startDate={exp.start_date}
                      endDate={exp.end_date}
                      location={exp.location}
                      description={exp.description}
                      highlights={exp.highlights}
                      situation={exp.situation}
                      approach={exp.approach}
                      technicalWork={exp.technical_work}
                      lessonsLearned={exp.lessons_learned}
                    />
                  </AnimatedSection>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
