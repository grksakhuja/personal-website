/**
 * Database type definitions
 * Mirrors the PostgreSQL schema for type safety
 */

export interface CandidateProfile {
  id: number;
  name: string;
  title: string;
  taglines: string[];
  bio: string | null;
  location: string | null;
  status: 'open' | 'not_looking' | 'selective';
  preferred_roles: string[];
  preferred_company_stages: string[];
  years_experience: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  start_date: Date;
  end_date: Date | null; // null = current role
  location: string | null;
  description: string | null;
  // AI Context fields
  situation: string | null;
  approach: string | null;
  technical_work: string | null;
  lessons_learned: string | null;
  highlights: string[];
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string | null;
  proficiency: 'strong' | 'moderate' | 'gap';
  years_used: number | null;
  context: string | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface GapWeakness {
  id: number;
  area: string;
  description: string;
  is_dealbreaker: boolean;
  mitigation: string | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface FAQResponse {
  id: number;
  question: string;
  answer: string;
  category: 'technical' | 'process' | 'personal' | 'career' | null;
  is_suggested: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface AIInstruction {
  id: number;
  category: 'identity' | 'anti_sycophancy' | 'tone' | 'boundaries' | 'examples';
  instruction: string;
  priority: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ChatMessage {
  id: number;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, unknown>;
  created_at: Date;
}

export type JDVerdict = 'strong_fit' | 'worth_conversation' | 'probably_not';

export interface JDAnalysis {
  id: number;
  job_description: string;
  verdict: JDVerdict;
  where_i_dont_fit: string[];
  what_transfers: string[];
  recommendation: string | null;
  opening_paragraph: string | null;
  is_demo: boolean;
  demo_type: 'strong_fit' | 'weak_fit' | null;
  session_id: string | null;
  created_at: Date;
}

// API request/response types

export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  sessionId?: string;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
}

export interface JDAnalyzeRequest {
  jobDescription: string;
}

export interface JDAnalyzeResponse {
  verdict: JDVerdict;
  openingParagraph: string;
  whereIDontFit: string[];
  whatTransfers: string[];
  recommendation: string;
}

// Profile API response (combines multiple tables)
export interface ProfileResponse {
  profile: CandidateProfile;
  experiences: Experience[];
  skills: Skill[];
  gaps: GapWeakness[];
  suggestedQuestions: FAQResponse[];
}

// Skill categories with proficiency grouping
export interface SkillsByProficiency {
  strong: Skill[];
  moderate: Skill[];
  gap: Skill[];
}
