"use client";
import { useState } from "react";

export default function JobChecker() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const data = await res.json();
      setResult(data.prediction === 1 ? "⚠️ Fake Job Posting" : "✅ Real Job Posting");
    } catch (err) {
      setResult("❌ Error connecting to API");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Job Post Checker</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2 text-black"
          rows={6}
          placeholder="Paste job description here..."
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {result && <p className="mt-4 text-lg font-semibold">{result}</p>}
    </div>
  );
}
