export const personalInfo = {
  name: "Rohit Sakhuja",
  title: "Senior Platform Engineer",
  taglines: [
    "Platform Engineer",
    "DevOps Specialist",
    "Cloud Architect"
  ],
  bio: "Platform Engineer with 10+ years of experience building scalable cloud infrastructure. Passionate about GitOps, Kubernetes, and developer experience.",
  location: "United Kingdom",
};

export const skills = [
  { name: "Azure", icon: "azure" },
  { name: "AWS", icon: "aws" },
  { name: "Kubernetes", icon: "kubernetes" },
  { name: "Docker", icon: "docker" },
  { name: "Terraform", icon: "terraform" },
  { name: "Argo CD", icon: "argo" },
  { name: "Python", icon: "python" },
  { name: "Go", icon: "go" },
  { name: "TypeScript", icon: "typescript" },
  { name: "Redis", icon: "redis" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "Istio", icon: "istio" },
  { name: "Git", icon: "git" },
  { name: "Linux", icon: "linux" },
  { name: "Helm", icon: "helm" },
  { name: "Prometheus", icon: "prometheus" },
];

export const projects = [
  {
    title: "Sugar Art Diva",
    description: "Custom artisan cake business website with online ordering and gallery showcase. Built through a consultative process to meet specific business needs.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Railway"],
    liveUrl: "https://cakecraftpro-app-production.up.railway.app/",
  },
  {
    title: "Pleasure & Purpose",
    description: "Lifestyle and wellness website created through a consultative process to deliver a tailored digital presence for the client's brand.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Railway"],
    liveUrl: "https://web-production-56e2a.up.railway.app/",
  },
  {
    title: "Self-Service Platform",
    description: "API-driven infrastructure provisioning platform enabling standardized environment deployment via Terraform generation while maintaining governance.",
    tech: ["Go", "Terraform", "Azure", "Argo CD", "Python"],
    liveUrl: null,
  },
];

export const socialLinks = [
  { name: "LinkedIn", url: "https://linkedin.com/in/rohitsakhuja", icon: "linkedin" },
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
