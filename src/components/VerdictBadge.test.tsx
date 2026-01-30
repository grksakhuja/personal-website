import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import VerdictBadge from './VerdictBadge';

describe('VerdictBadge', () => {
  it('renders strong fit badge correctly', () => {
    render(<VerdictBadge verdict="strong_fit" />);
    expect(screen.getByText('Strong Fit')).toBeInTheDocument();
  });

  it('renders worth conversation badge correctly', () => {
    render(<VerdictBadge verdict="worth_conversation" />);
    expect(screen.getByText('Worth a Conversation')).toBeInTheDocument();
  });

  it('renders probably not badge correctly', () => {
    render(<VerdictBadge verdict="probably_not" />);
    expect(screen.getByText('Probably Not')).toBeInTheDocument();
  });

  it('applies correct CSS class for strong fit', () => {
    const { container } = render(<VerdictBadge verdict="strong_fit" />);
    expect(container.firstChild).toHaveClass('verdict-strong-fit');
  });

  it('applies correct CSS class for probably not', () => {
    const { container } = render(<VerdictBadge verdict="probably_not" />);
    expect(container.firstChild).toHaveClass('verdict-probably-not');
  });
});
