interface StatusBadgeProps {
  status?: 'open' | 'not_looking' | 'selective';
  roles?: string[];
  companyStages?: string[];
}

export default function StatusBadge({ status = 'open', roles = [], companyStages = [] }: StatusBadgeProps) {
  if (status === 'not_looking') {
    return (
      <span className="status-badge opacity-60">
        Not currently looking
      </span>
    );
  }

  const roleText = roles.length > 0 ? roles[0] : 'Platform Engineering';
  const stageText = companyStages.length > 1
    ? companyStages.slice(0, -1).join(', ') + ' & ' + companyStages[companyStages.length - 1]
    : companyStages.length > 0 ? companyStages[0] : 'Growth Stage';

  return (
    <span className="status-badge">
      {/* Desktop: full text */}
      <span className="hidden sm:inline">Open to {roleText} at {stageText}</span>
      {/* Mobile: shorter text */}
      <span className="sm:hidden">Open to opportunities</span>
    </span>
  );
}
