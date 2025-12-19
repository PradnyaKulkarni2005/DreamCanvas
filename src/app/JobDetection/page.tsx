"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle, XCircle, Shield, AlertTriangle, Sparkles } from "lucide-react";

type ResultType = {
  label: string;
  confidence: number;
};

type JobCheckerProps = {
  onClose?: () => void;
};

export default function JobChecker({ onClose }: JobCheckerProps) {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        "https://job-posting-detection-api.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        }
      );

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();

      setResult({
        label:
          data.prediction === 1
            ? "⚠️ Fake Job Posting"
            : "✅ Real Job Posting",
        confidence: data.confidence,
      });
    } catch (error) {
      console.error(error);
      setResult({
        label: "❌ Error checking the job posting",
        confidence: 0,
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white flex flex-col items-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 backdrop-blur-sm">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">AI-Powered Detection</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent animate-gradient leading-tight">
            Job Post Checker
          </h1>
          
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto px-4">
            Protect yourself from fraudulent job postings. Paste any job description and let our AI analyze it instantly.
          </p>
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-6 md:p-8">
          <div className="space-y-5">
            {/* Textarea */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition duration-300"></div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="relative w-full bg-slate-900/80 border border-white/10 rounded-2xl p-5 text-gray-100 focus:outline-none focus:border-emerald-500/50 placeholder-gray-500 transition-all duration-300 resize-none text-sm"
                rows={7}
                placeholder="Paste the job description here...&#10;&#10;Include details like company name, position, requirements, salary, and any other information provided."
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-slate-900/50 px-2 py-1 rounded">
                {description.length} characters
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !description.trim()}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Job Posting</span>
                </>
              )}
            </button>
          </div>

          {/* Result Display */}
          {result && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div
                className={`relative overflow-hidden rounded-2xl p-6 ${
                  result.label.includes("Fake")
                    ? "bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/30"
                    : result.label.includes("Real")
                    ? "bg-gradient-to-br from-emerald-900/40 to-cyan-900/40 border border-emerald-500/30"
                    : "bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/30"
                }`}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                
                <div className="relative space-y-3">
                  {/* Result Header */}
                  <div className="flex items-center justify-center gap-3">
                    {result.label.includes("Fake") ? (
                      <div className="p-2.5 bg-red-500/20 rounded-full">
                        <AlertTriangle className="w-7 h-7 text-red-400" />
                      </div>
                    ) : result.label.includes("Real") ? (
                      <div className="p-2.5 bg-emerald-500/20 rounded-full">
                        <CheckCircle className="w-7 h-7 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="p-2.5 bg-yellow-500/20 rounded-full">
                        <XCircle className="w-7 h-7 text-yellow-400" />
                      </div>
                    )}
                  </div>

                  {/* Result Text */}
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl md:text-3xl font-bold">
                      {result.label}
                    </h3>
                  </div>

                  {/* Additional Info */}
                  {result.label.includes("Fake") && (
                    <div className="mt-4 p-3 bg-black/20 rounded-xl border border-red-500/20">
                      <p className="text-xs md:text-sm text-gray-300 text-center">
                        <strong className="text-red-400">Warning:</strong> This posting shows characteristics of fraudulent job listings. Be cautious and verify through official channels.
                      </p>
                    </div>
                  )}
                  
                  {result.label.includes("Real") && (
                    <div className="mt-4 p-3 bg-black/20 rounded-xl border border-emerald-500/20">
                      <p className="text-xs md:text-sm text-gray-300 text-center">
                        <strong className="text-emerald-400">Good News:</strong> This posting appears legitimate. Still, always research the company independently.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-xs md:text-sm text-gray-500 px-4">
          <p>Always verify job postings through official company websites and trusted sources.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-bottom-4 {
          from { transform: translateY(1rem); }
          to { transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.5s ease-out, slide-in-from-bottom-4 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}