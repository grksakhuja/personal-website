import {
  SiAmazonwebservices,
  SiKubernetes,
  SiDocker,
  SiHelm,
  SiTerraform,
  SiArgo,
  SiFlux,
  SiPython,
  SiGo,
  SiTypescript,
  SiRedis,
  SiPostgresql,
  SiMysql,
  SiPrometheus,
  SiGrafana,
  SiSentry,
  SiOpentelemetry,
  SiGit,
  SiLinux,
  SiIstio,
  SiCloudflare,
  SiGithubactions,
  SiGitlab,
  SiJenkins,
  SiTraefikproxy,
  SiNginx,
  SiVault,
  SiSnyk,
  SiMongodb,
  SiApachekafka,
  SiGnubash,
  SiClaude,
  SiReact,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import type { IconType } from 'react-icons';

// Custom Azure icon
const AzureIcon: IconType = ({ size = 24, color = '#0078D4', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
    <path d="M5.483 21.3H24L14.025 4.013l-3.038 8.347 5.836 6.938L5.483 21.3zM13.23 2.7L6.105 8.677 0 19.253h5.505v.014L13.23 2.7z"/>
  </svg>
);

// Custom Kustomize icon
const KustomizeIcon: IconType = ({ size = 24, color = '#326CE5', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
    <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm0 2.25l8.25 4.72v9.06L12 20.75l-8.25-4.72V6.97L12 2.25zm0 3.5L6.5 8.92v6.16L12 18.25l5.5-3.17V8.92L12 5.75zm0 2.25l3.25 1.87v3.76L12 15.5l-3.25-1.87V9.87L12 8z"/>
  </svg>
);

// Custom Loki icon
const LokiIcon: IconType = ({ size = 24, color = '#F46800', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6a8.4 8.4 0 1 1 0 16.8 8.4 8.4 0 0 1 0-16.8zm0 2.4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 2.4a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2z"/>
  </svg>
);

// Custom Spacelift icon
const SpaceliftIcon: IconType = ({ size = 24, color = '#4353FF', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l7.5 3.75L12 11.68 4.5 7.93 12 4.18zM4 9.07l7 3.5v7.36l-7-3.5V9.07zm9 10.86v-7.36l7-3.5v7.36l-7 3.5z"/>
  </svg>
);

// Custom CosmosDB icon
const CosmosDBIcon: IconType = ({ size = 24, color = '#0078D4', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
    <circle cx="12" cy="12" r="3"/>
    <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke={color} strokeWidth="1.5"/>
    <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke={color} strokeWidth="1.5" transform="rotate(60 12 12)"/>
    <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke={color} strokeWidth="1.5" transform="rotate(120 12 12)"/>
  </svg>
);

// Custom Azure Key Vault icon
const KeyVaultIcon: IconType = ({ size = 24, color = '#0078D4', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v5.7c0 4.5-3.08 8.68-7 9.82-3.92-1.14-7-5.32-7-9.82V6.3l7-3.12zM11 7v4H9v2h2v4h2v-4h2v-2h-2V7h-2z"/>
  </svg>
);

// Custom Sealed Secrets icon
const SealedSecretsIcon: IconType = ({ size = 24, color = '#326CE5', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
  </svg>
);

// Custom Windsurf icon
const WindsurfIcon: IconType = ({ size = 24, color = '#00D4AA', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
    <path d="M21 3L3 10.5v1.5l7.5 2.25L13.5 21h1.5L21 3zm-4.5 4.5l-3 9-2.25-6.75L21 6l-4.5 1.5z"/>
  </svg>
);

// Custom VS Code icon
const VSCodeIcon: IconType = ({ size = 24, color = '#007ACC', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
    <path d="M17.583 2L6.25 11.5l-3.75-2.917L1 9.5v5l1.5.917 3.75-2.917L17.583 22 23 19.5v-15L17.583 2zM17 17.5l-7-5.5 7-5.5v11zm-14-1v-9l3 2.25v4.5L3 16.5z"/>
  </svg>
);

// Brand colors for each icon
const iconColors: Record<string, string> = {
  // Cloud
  azure: '#0078D4',
  aws: '#FF9900',
  cloudflare: '#F38020',
  // Orchestration
  kubernetes: '#326CE5',
  docker: '#2496ED',
  helm: '#0F1689',
  kustomize: '#326CE5',
  // IaC / GitOps
  terraform: '#7B42BC',
  argo: '#EF7B4D',
  flux: '#5468FF',
  // CI/CD
  githubactions: '#2088FF',
  gitlab: '#FC6D26',
  spacelift: '#4353FF',
  jenkins: '#D24939',
  // Service Mesh
  traefik: '#24A1C1',
  nginx: '#009639',
  istio: '#466BB0',
  // Security
  vault: '#FFEC6E',
  keyvault: '#0078D4',
  sealedsecrets: '#326CE5',
  snyk: '#4C4A73',
  // Languages
  python: '#3776AB',
  go: '#00ADD8',
  typescript: '#3178C6',
  bash: '#4EAA25',
  // Data
  redis: '#DC382D',
  postgresql: '#4169E1',
  mysql: '#4479A1',
  mongodb: '#47A248',
  kafka: '#231F20',
  cosmosdb: '#0078D4',
  // Observability
  prometheus: '#E6522C',
  grafana: '#F46800',
  sentry: '#362D59',
  opentelemetry: '#F5A800',
  loki: '#F46800',
  // Tooling
  git: '#F05032',
  linux: '#FCC624',
  // AI & IDEs
  claude: '#D4A27F',
  windsurf: '#00D4AA',
  vscode: '#007ACC',
  // Frontend
  react: '#61DAFB',
  // JVM
  java: '#ED8B00',
};

// Map icon names to components
const iconComponents: Record<string, IconType> = {
  // Cloud
  azure: AzureIcon,
  aws: SiAmazonwebservices,
  cloudflare: SiCloudflare,
  // Orchestration
  kubernetes: SiKubernetes,
  docker: SiDocker,
  helm: SiHelm,
  kustomize: KustomizeIcon,
  // IaC / GitOps
  terraform: SiTerraform,
  argo: SiArgo,
  flux: SiFlux,
  // CI/CD
  githubactions: SiGithubactions,
  gitlab: SiGitlab,
  spacelift: SpaceliftIcon,
  jenkins: SiJenkins,
  // Service Mesh
  traefik: SiTraefikproxy,
  nginx: SiNginx,
  istio: SiIstio,
  // Security
  vault: SiVault,
  keyvault: KeyVaultIcon,
  sealedsecrets: SealedSecretsIcon,
  snyk: SiSnyk,
  // Languages
  python: SiPython,
  go: SiGo,
  typescript: SiTypescript,
  bash: SiGnubash,
  // Data
  redis: SiRedis,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  mongodb: SiMongodb,
  kafka: SiApachekafka,
  cosmosdb: CosmosDBIcon,
  // Observability
  prometheus: SiPrometheus,
  grafana: SiGrafana,
  sentry: SiSentry,
  opentelemetry: SiOpentelemetry,
  loki: LokiIcon,
  // Tooling
  git: SiGit,
  linux: SiLinux,
  // AI & IDEs
  claude: SiClaude,
  windsurf: WindsurfIcon,
  vscode: VSCodeIcon,
  // Frontend
  react: SiReact,
  // JVM
  java: FaJava,
};

interface TechIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function TechIcon({ name, size = 32, className = '' }: TechIconProps) {
  const key = name.toLowerCase();
  const IconComponent = iconComponents[key];
  const color = iconColors[key] || '#e5e5e5';

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} color={color} className={className} />;
}

// Export for backwards compatibility
export const techIcons = iconComponents;
export const techIconColors = iconColors;
