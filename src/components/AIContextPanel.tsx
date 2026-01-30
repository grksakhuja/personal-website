import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIContextPanelProps {
  situation?: string;
  approach?: string;
  technicalWork?: string;
  lessonsLearned?: string;
}

export default function AIContextPanel({
  situation,
  approach,
  technicalWork,
  lessonsLearned,
}: AIContextPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if no context data
  if (!situation && !approach && !technicalWork && !lessonsLearned) {
    return null;
  }

  return (
    <div className="ai-context-panel">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ai-context-label"
      >
        <Sparkles size={14} />
        AI Context
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4 text-sm">
              {situation && (
                <div>
                  <h4 className="text-[--color-teal] font-medium text-xs uppercase tracking-wide mb-1">
                    Situation
                  </h4>
                  <p className="text-[--color-text-muted] leading-relaxed">
                    {situation}
                  </p>
                </div>
              )}

              {approach && (
                <div>
                  <h4 className="text-[--color-teal] font-medium text-xs uppercase tracking-wide mb-1">
                    Approach
                  </h4>
                  <p className="text-[--color-text-muted] leading-relaxed">
                    {approach}
                  </p>
                </div>
              )}

              {technicalWork && (
                <div>
                  <h4 className="text-[--color-teal] font-medium text-xs uppercase tracking-wide mb-1">
                    Technical Work
                  </h4>
                  <p className="text-[--color-text-muted] leading-relaxed">
                    {technicalWork}
                  </p>
                </div>
              )}

              {lessonsLearned && (
                <div>
                  <h4 className="text-[--color-teal] font-medium text-xs uppercase tracking-wide mb-1">
                    Lessons Learned
                  </h4>
                  <p className="text-[--color-text-muted] leading-relaxed">
                    {lessonsLearned}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
