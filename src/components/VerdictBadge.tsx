import { CheckCircle, MessageCircle, AlertCircle } from 'lucide-react';
import type { JDVerdict } from '../types/database';

interface VerdictBadgeProps {
  verdict: JDVerdict;
}

const verdictConfig = {
  strong_fit: {
    label: 'Strong Fit',
    className: 'verdict-strong-fit',
    Icon: CheckCircle,
  },
  worth_conversation: {
    label: 'Worth a Conversation',
    className: 'verdict-worth-conversation',
    Icon: MessageCircle,
  },
  probably_not: {
    label: 'Probably Not',
    className: 'verdict-probably-not',
    Icon: AlertCircle,
  },
};

export default function VerdictBadge({ verdict }: VerdictBadgeProps) {
  const config = verdictConfig[verdict];
  const { Icon } = config;

  return (
    <span className={`verdict-badge ${config.className}`}>
      <Icon size={16} />
      {config.label}
    </span>
  );
}
