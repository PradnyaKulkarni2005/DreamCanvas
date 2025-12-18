"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type ResultType = {
  label: string;
  confidence: number;
};

export default function JobChecker() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    <div className="min-h-screen bg-[#0b0b0b] text-emerald-400 flex flex-col items-center px-6 py-10 relative">
      {/* Close button */}
      <div className="absolute top-5 right-6">
        <button
          onClick={() => router.push("/")}
          className="text-emerald-400 hover:text-emerald-300 transition"
          title="Go back"
        >
          <X size={26} />
        </button>
      </div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        Job Post Checker
      </motion.h1>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-4"
      >
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#111111] border border-emerald-700 rounded-xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
          rows={6}
          placeholder="Paste job description here..."
        />

        <button
          type="submit"
          disabled={loading || !description.trim()}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-2 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Checking (waking AI model)...
            </>
          ) : (
            "Check"
          )}
        </button>
      </motion.form>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-8 text-center text-lg font-semibold px-6 py-4 rounded-xl ${
            result.label.includes("Fake")
              ? "bg-red-900/30 text-red-400"
              : result.label.includes("Real")
              ? "bg-emerald-900/30 text-emerald-400"
              : "bg-yellow-900/30 text-yellow-400"
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            {result.label.includes("Fake") ? (
              <XCircle className="w-5 h-5" />
            ) : result.label.includes("Real") ? (
              <CheckCircle className="w-5 h-5" />
            ) : null}
            {result.label}
          </div>

         
        </motion.div>
      )}
    </div>
  );
}
