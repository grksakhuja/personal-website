import VerdictBadge from './VerdictBadge';
import type { JDAnalyzeResponse } from '../types/database';

interface AnalysisResultProps {
  result: JDAnalyzeResponse;
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="glass-card p-6 mt-6">
      {/* Verdict */}
      <div className="mb-4">
        <VerdictBadge verdict={result.verdict} />
      </div>

      {/* Opening paragraph */}
      <p className="text-[--color-text-primary] text-base leading-relaxed mb-6">
        {result.openingParagraph}
      </p>

      {/* Where I Don't Fit */}
      {result.whereIDontFit.length > 0 && (
        <div className="analysis-section">
          <h4 className="analysis-section-title">Where I Don't Fit</h4>
          <ul className="analysis-list gaps">
            {result.whereIDontFit.map((gap, index) => (
              <li key={index}>{gap}</li>
            ))}
          </ul>
        </div>
      )}

      {/* What Transfers */}
      {result.whatTransfers.length > 0 && (
        <div className="analysis-section">
          <h4 className="analysis-section-title">What Transfers</h4>
          <ul className="analysis-list transfers">
            {result.whatTransfers.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation */}
      <div className="analysis-section">
        <h4 className="analysis-section-title">My Recommendation</h4>
        <p className="text-[--color-text-primary] text-sm leading-relaxed">
          {result.recommendation}
        </p>
      </div>
    </div>
  );
}
