interface JDInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function JDInput({ value, onChange, disabled }: JDInputProps) {
  return (
    <textarea
      className="jd-textarea w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste job description here... Include the role, requirements, and any specific technologies or experience needed."
      disabled={disabled}
      rows={8}
    />
  );
}
