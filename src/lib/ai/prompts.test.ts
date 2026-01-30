import { describe, it, expect } from 'vitest';
import { buildChatSystemPrompt, buildJDAnalysisPrompt, formatJDAnalysisUserMessage } from './prompts';

const mockContext = {
  profile: {
    id: 1,
    name: 'Test User',
    title: 'Senior Platform Engineer',
    taglines: ['Platform Engineer'],
    bio: 'Test bio',
    location: 'Remote',
    status: 'open' as const,
    preferred_roles: ['Platform Engineer'],
    preferred_company_stages: ['Growth Stage'],
    years_experience: 10,
    created_at: new Date(),
    updated_at: new Date(),
  },
  experiences: [],
  skills: {
    strong: [
      { id: 1, name: 'Kubernetes', category: 'Orchestration', icon: 'kubernetes', proficiency: 'strong' as const, years_used: 5, context: 'Daily use', display_order: 1, created_at: new Date(), updated_at: new Date() },
    ],
    moderate: [
      { id: 2, name: 'Python', category: 'Languages', icon: 'python', proficiency: 'moderate' as const, years_used: 3, context: 'Scripting', display_order: 2, created_at: new Date(), updated_at: new Date() },
    ],
    gap: [
      { id: 3, name: 'React Native', category: 'Mobile', icon: 'react', proficiency: 'gap' as const, years_used: 0, context: 'No experience', display_order: 3, created_at: new Date(), updated_at: new Date() },
    ],
  },
  gaps: [
    { id: 1, area: 'Mobile Development', description: 'No mobile experience', is_dealbreaker: true, mitigation: null, display_order: 1, created_at: new Date(), updated_at: new Date() },
  ],
  faqs: [],
  instructions: [
    { id: 1, category: 'anti_sycophancy' as const, instruction: 'Never overstate experience', priority: 100, is_active: true, created_at: new Date(), updated_at: new Date() },
  ],
};

describe('buildChatSystemPrompt', () => {
  it('returns fallback message when no profile', () => {
    const prompt = buildChatSystemPrompt({
      ...mockContext,
      profile: null,
    });
    expect(prompt).toContain('don\'t have access to profile information');
  });

  it('includes profile name and title', () => {
    const prompt = buildChatSystemPrompt(mockContext);
    expect(prompt).toContain('Test User');
    expect(prompt).toContain('Senior Platform Engineer');
  });

  it('includes strong skills', () => {
    const prompt = buildChatSystemPrompt(mockContext);
    expect(prompt).toContain('Kubernetes');
  });

  it('includes gap skills', () => {
    const prompt = buildChatSystemPrompt(mockContext);
    expect(prompt).toContain('React Native');
  });

  it('includes dealbreakers', () => {
    const prompt = buildChatSystemPrompt(mockContext);
    expect(prompt).toContain('Mobile Development');
    expect(prompt).toContain('DEALBREAKERS');
  });

  it('includes AI instructions', () => {
    const prompt = buildChatSystemPrompt(mockContext);
    expect(prompt).toContain('Never overstate experience');
  });
});

describe('buildJDAnalysisPrompt', () => {
  it('returns fallback message when no profile', () => {
    const prompt = buildJDAnalysisPrompt({
      ...mockContext,
      profile: null,
    });
    expect(prompt).toContain('profile data not available');
  });

  it('includes profile information', () => {
    const prompt = buildJDAnalysisPrompt(mockContext);
    expect(prompt).toContain('Test User');
    expect(prompt).toContain('Senior Platform Engineer');
  });

  it('includes anti-sycophancy rules', () => {
    const prompt = buildJDAnalysisPrompt(mockContext);
    expect(prompt).toContain('ANTI-SYCOPHANCY');
    expect(prompt).toContain('Never overstate experience');
  });

  it('includes skills by proficiency', () => {
    const prompt = buildJDAnalysisPrompt(mockContext);
    expect(prompt).toContain('STRONG SKILLS');
    expect(prompt).toContain('Kubernetes');
    expect(prompt).toContain('GAP SKILLS');
    expect(prompt).toContain('React Native');
  });

  it('includes dealbreakers', () => {
    const prompt = buildJDAnalysisPrompt(mockContext);
    expect(prompt).toContain('EXPLICIT DEALBREAKERS');
    expect(prompt).toContain('Mobile Development');
  });

  it('specifies JSON response format', () => {
    const prompt = buildJDAnalysisPrompt(mockContext);
    expect(prompt).toContain('RESPONSE FORMAT');
    expect(prompt).toContain('verdict');
    expect(prompt).toContain('strong_fit');
    expect(prompt).toContain('probably_not');
  });

  it('includes verdict criteria', () => {
    const prompt = buildJDAnalysisPrompt(mockContext);
    expect(prompt).toContain('VERDICT CRITERIA');
  });
});

describe('formatJDAnalysisUserMessage', () => {
  it('includes the job description', () => {
    const jd = 'Senior Platform Engineer at Acme Corp';
    const message = formatJDAnalysisUserMessage(jd);
    expect(message).toContain(jd);
  });

  it('includes delimiter markers', () => {
    const message = formatJDAnalysisUserMessage('Any JD');
    expect(message).toContain('---');
  });

  it('includes JSON-only response instruction', () => {
    const message = formatJDAnalysisUserMessage('Any JD');
    expect(message).toContain('Respond with JSON only');
  });
});
