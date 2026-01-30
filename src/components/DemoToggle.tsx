interface DemoToggleProps {
  activeDemo: 'strong_fit' | 'weak_fit' | null;
  onSelect: (type: 'strong_fit' | 'weak_fit' | null) => void;
}

export default function DemoToggle({ activeDemo, onSelect }: DemoToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className={`demo-toggle ${activeDemo === 'strong_fit' ? 'active' : ''}`}
        onClick={() => onSelect(activeDemo === 'strong_fit' ? null : 'strong_fit')}
      >
        Strong Fit Example
      </button>
      <button
        type="button"
        className={`demo-toggle ${activeDemo === 'weak_fit' ? 'active' : ''}`}
        onClick={() => onSelect(activeDemo === 'weak_fit' ? null : 'weak_fit')}
      >
        Weak Fit Example
      </button>
    </div>
  );
}
