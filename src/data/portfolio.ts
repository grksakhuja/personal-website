export const personalInfo = {
  name: "Rohit Sakhuja",
  title: "Senior Platform Engineer",
  taglines: [
    "Platform Engineer",
    "DevOps Specialist",
    "Cloud Architect"
  ],
  bio: "Platform Engineer with 10+ years of experience building scalable cloud infrastructure. Passionate about GitOps, Kubernetes, developer experience, and AI-assisted development.",
  location: "Remote | Malaysia",
};

export const skillCategories = [
  {
    name: "Cloud",
    skills: [
      { name: "Azure", icon: "azure" },
      { name: "AWS", icon: "aws" },
      { name: "Cloudflare", icon: "cloudflare" },
    ],
  },
  {
    name: "Orchestration",
    skills: [
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "Docker", icon: "docker" },
      { name: "Helm", icon: "helm" },
      { name: "Kustomize", icon: "kustomize" },
    ],
  },
  {
    name: "IaC / GitOps",
    skills: [
      { name: "Terraform", icon: "terraform" },
      { name: "Argo CD", icon: "argo" },
      { name: "Flux", icon: "flux" },
    ],
  },
  {
    name: "CI/CD",
    skills: [
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "GitLab CI", icon: "gitlab" },
      { name: "Spacelift", icon: "spacelift" },
      { name: "Jenkins", icon: "jenkins" },
    ],
  },
  {
    name: "Service Mesh",
    skills: [
      { name: "Istio", icon: "istio" },
      { name: "Traefik", icon: "traefik" },
      { name: "Nginx", icon: "nginx" },
    ],
  },
  {
    name: "Security",
    skills: [
      { name: "Vault", icon: "vault" },
      { name: "Key Vault", icon: "keyvault" },
      { name: "Sealed Secrets", icon: "sealedsecrets" },
      { name: "Snyk", icon: "snyk" },
    ],
  },
  {
    name: "Languages",
    skills: [
      { name: "Python", icon: "python" },
      { name: "Go", icon: "go" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Bash", icon: "bash" },
    ],
  },
  {
    name: "Data",
    skills: [
      { name: "Redis", icon: "redis" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Kafka", icon: "kafka" },
      { name: "CosmosDB", icon: "cosmosdb" },
    ],
  },
  {
    name: "Observability",
    skills: [
      { name: "Prometheus", icon: "prometheus" },
      { name: "Grafana", icon: "grafana" },
      { name: "Loki", icon: "loki" },
      { name: "OpenTelemetry", icon: "opentelemetry" },
      { name: "Sentry", icon: "sentry" },
    ],
  },
  {
    name: "Tooling",
    skills: [
      { name: "Git", icon: "git" },
      { name: "Linux", icon: "linux" },
    ],
  },
  {
    name: "AI & IDEs",
    skills: [
      { name: "Claude", icon: "claude" },
      { name: "Windsurf", icon: "windsurf" },
      { name: "VS Code", icon: "vscode" },
    ],
  },
];

export const projects = [
  {
    title: "Roots Men's Grooming",
    description: "Premium barbershop website for a Kuala Lumpur-based men's grooming business. Features video backgrounds, online booking integration, service pricing, team showcase, and location information.",
    tech: ["HTML", "CSS", "JavaScript", "Vercel"],
    liveUrl: "https://roots-hairdressers.vercel.app/",
    featured: true,
  },
  {
    title: "Sugar Art Diva",
    description: "Custom artisan cake business website with online ordering and gallery showcase. Built through a consultative process to meet specific business needs.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Railway"],
    liveUrl: "https://cakecraftpro-app-production.up.railway.app/",
    featured: true,
  },
  {
    title: "Sweets4U",
    description: "Fast, lightweight e-commerce site for a local sweet shop. No CMS needed - products are managed directly in Stripe Dashboard. Features Stripe Checkout for secure payments, automatic product sync via custom CLI tooling, and AI-powered product enrichment.",
    tech: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS", "Vercel"],
    liveUrl: "https://bobby-sweets.vercel.app/",
    featured: false,
  },
  {
    title: "Pleasure & Purpose",
    description: "Lifestyle and wellness website created through a consultative process to deliver a tailored digital presence for the client's brand.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Railway"],
    liveUrl: "https://web-production-56e2a.up.railway.app/",
    featured: false,
  },
  {
    title: "Self-Service Platform",
    description: "API-driven infrastructure provisioning platform enabling standardized environment deployment via Terraform generation while maintaining governance.",
    tech: ["Go", "Terraform", "Azure", "Argo CD", "Python"],
    liveUrl: null,
    featured: false,
  },
];

export const socialLinks = [
  { name: "LinkedIn", url: "https://linkedin.com/in/rohit-sakhuja", icon: "linkedin" },
  { name: "GitHub", url: "https://github.com/grksakhuja", icon: "github" },
];

// Email protection - obfuscated to prevent scraping
export const getEmail = () => {
  const parts = ['rksakhuja', 'gmail', 'com'];
  return `${parts[0]}@${parts[1]}.${parts[2]}`;
};

export const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];
