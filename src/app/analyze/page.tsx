'use client';
import { useState } from 'react';
import Loader from '@/app/components/Loader';
import RoleSelector from '@/app/components/RoleSelector';
import { useRouter } from 'next/navigation';
import '@/app/components/inputfield.css';

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

      if (data.error) throw new Error(data.error);
      if (!data.roadmap) throw new Error('Invalid response format received.');

      localStorage.setItem('roadmap', JSON.stringify(data.roadmap));
      localStorage.setItem('missingSkills', JSON.stringify(data.missingSkills));
      localStorage.setItem('targetRole', role);

      router.push('/roadmap');
    } catch (error: any) {
      console.error("Roadmap generation error:", error);
      alert(error.message || "Error generating roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Skill Gap Analyzer</h1>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Loader />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Your Current Skills</label>
            <textarea
              rows={4}
              placeholder="e.g., HTML, CSS, JavaScript, React"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="input"
            />
          </div>

          <RoleSelector value={role} onChange={setRole} />

          {role && (
            <p className="text-sm text-gray-600">
              Selected Role: <strong>{role}</strong>
            </p>
          )}

          <button
            type="submit"
            className={`bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Roadmap'}
          </button>
        </form>
      )}
    </div>
  );
}
