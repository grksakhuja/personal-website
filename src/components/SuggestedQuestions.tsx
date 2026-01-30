interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}

// Default questions if none are loaded from the API
const defaultQuestions = [
  'What is your experience with Kubernetes?',
  'How do you approach infrastructure as code?',
  'What type of roles are you looking for?',
  'How do you work with development teams?',
];

export default function SuggestedQuestions({ questions, onSelect, disabled }: SuggestedQuestionsProps) {
  const displayQuestions = questions.length > 0 ? questions : defaultQuestions;

  return (
    <div className="p-4">
      <p className="text-xs text-[--color-text-muted] mb-3 uppercase tracking-wide">
        Suggested questions
      </p>
      <div className="flex flex-wrap gap-2">
        {displayQuestions.slice(0, 4).map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            disabled={disabled}
            className="text-left text-xs px-3 py-2 bg-[--color-surface] border border-white/10 rounded-lg text-[--color-text-muted] hover:text-[--color-text-primary] hover:border-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
