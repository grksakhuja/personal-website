import { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import JDInput from '../components/JDInput';
import DemoToggle from '../components/DemoToggle';
import AnalysisResult from '../components/AnalysisResult';
import type { JDAnalyzeResponse } from '../types/database';

// Demo JDs for quick testing
const demoJDs = {
  strong_fit: `Senior Platform Engineer

About the Role:
We're looking for a Senior Platform Engineer to join our infrastructure team. You'll be responsible for building and maintaining our Kubernetes-based platform, implementing GitOps practices, and improving developer experience.

Requirements:
- 5+ years experience with Kubernetes in production
- Strong Terraform/IaC expertise
- Experience with Azure or AWS cloud platforms
- GitOps practices (ArgoCD, Flux)
- CI/CD pipeline design (GitHub Actions preferred)
- Strong Linux and scripting skills

Nice to have:
- Experience with service mesh (Istio)
- Observability stack (Prometheus, Grafana)
- Go or Python programming
- Platform engineering in a startup/scale-up environment`,

  weak_fit: `Senior Mobile Engineer

About the Role:
We're building the next generation of mobile experiences and need a Senior Mobile Engineer to lead our React Native development. You'll architect our cross-platform mobile app and mentor junior developers.

Requirements:
- 4+ years React Native development experience
- Published apps on App Store and Google Play
- Experience with mobile CI/CD (Fastlane, App Center)
- Strong understanding of iOS and Android platform specifics
- TypeScript expertise
- Experience with mobile state management (Redux, MobX)

Nice to have:
- Native iOS (Swift) or Android (Kotlin) experience
- Experience with mobile analytics and crash reporting
- Background in fintech or regulated industries`,
};

export default function JDAnalyzer() {
  const [jobDescription, setJobDescription] = useState('');
  const [activeDemo, setActiveDemo] = useState<'strong_fit' | 'weak_fit' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<JDAnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleDemoSelect = (type: 'strong_fit' | 'weak_fit' | null) => {
    setActiveDemo(type);
    if (type) {
      setJobDescription(demoJDs[type]);
    } else {
      setJobDescription('');
    }
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;

    // Cancel any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
        signal: controller.signal,
      });

      if (!response.ok) {
        // Parse server error message instead of using generic fallback
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Analysis failed. Please try again.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      // Don't show error if request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsAnalyzing(false);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  return (
    <section id="fit-check" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[--color-text-primary] mb-4">
              Honest Fit Assessment
            </h2>
            <p className="text-[--color-text-muted] text-lg max-w-2xl mx-auto">
              Paste a job description. Get an honest assessment of whether I'm the right person—including when I'm not.
            </p>
          </div>

          {/* Input area */}
          <div className="space-y-4">
            {/* Demo toggles */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <DemoToggle activeDemo={activeDemo} onSelect={handleDemoSelect} />
              <span className="text-[--color-text-muted] text-xs">
                Try a demo or paste your own
              </span>
            </div>

            {/* Textarea */}
            <JDInput
              value={jobDescription}
              onChange={(val) => {
                setJobDescription(val);
                setActiveDemo(null);
              }}
              disabled={isAnalyzing}
            />

            {/* Analyze button */}
            <div className="flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobDescription.trim()}
                className="cta-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isAnalyzing ? (
                  <>
                    <span className="spinner" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analyze Fit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnalysisResult result={result} />
            </motion.div>
          )}

        </AnimatedSection>
      </div>
    </section>
  );
}
