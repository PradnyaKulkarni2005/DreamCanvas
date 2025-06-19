'use client';
import { useState } from 'react';
import RoleSelector from '@/app/components/RoleSelector';
import { useRouter } from 'next/navigation';

export default function AnalyzePage() {
  const router = useRouter();
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!skills || !role) {
      return alert("Please fill in all fields");
    }

    setLoading(true);

    try {
      const res = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills, role }),
      });

      const data = await res.json();
      

      if (!data.roadmap) {
        throw new Error('Invalid response from AI');
      }

      // Save to localStorage or Zustand
      localStorage.setItem('roadmap', JSON.stringify(data.roadmap));
      localStorage.setItem('missingSkills', JSON.stringify(data.missingSkills));
      localStorage.setItem('targetRole', role);

      router.push('/roadmap');
    } catch (error) {
      alert("Error generating roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Skill Gap Analyzer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Your Current Skills</label>
          <textarea
            className="w-full border rounded-md p-2"
            rows={4}
            placeholder="e.g., HTML, CSS, JavaScript, React"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        <RoleSelector value={role} onChange={setRole} />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Roadmap"}
        </button>
      </form>
    </div>
  );
}
