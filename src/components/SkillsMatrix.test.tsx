import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkillsMatrix from './SkillsMatrix';

const mockSkills = [
  { name: 'Kubernetes', icon: 'kubernetes', proficiency: 'strong' as const },
  { name: 'Docker', icon: 'docker', proficiency: 'strong' as const },
  { name: 'Python', icon: 'python', proficiency: 'moderate' as const },
  { name: 'React Native', icon: 'react', proficiency: 'gap' as const },
];

describe('SkillsMatrix', () => {
  it('renders all three proficiency columns', () => {
    render(<SkillsMatrix skills={mockSkills} />);

    expect(screen.getByText('Strong')).toBeInTheDocument();
    expect(screen.getByText('Moderate')).toBeInTheDocument();
    expect(screen.getByText('Gaps')).toBeInTheDocument();
  });

  it('renders strong skills correctly', () => {
    render(<SkillsMatrix skills={mockSkills} />);

    expect(screen.getByText('Kubernetes')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  it('renders moderate skills correctly', () => {
    render(<SkillsMatrix skills={mockSkills} />);

    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('renders gap skills correctly', () => {
    render(<SkillsMatrix skills={mockSkills} />);

    expect(screen.getByText('React Native')).toBeInTheDocument();
  });

  it('renders column descriptions', () => {
    render(<SkillsMatrix skills={mockSkills} />);

    expect(screen.getByText('Daily use, deep expertise')).toBeInTheDocument();
    expect(screen.getByText('Competent, used regularly')).toBeInTheDocument();
    expect(screen.getByText('Limited or no experience')).toBeInTheDocument();
  });

  it('renders column headers with empty skills array', () => {
    render(<SkillsMatrix skills={[]} />);

    expect(screen.getByText('Strong')).toBeInTheDocument();
    expect(screen.getByText('Moderate')).toBeInTheDocument();
    expect(screen.getByText('Gaps')).toBeInTheDocument();
  });
});
