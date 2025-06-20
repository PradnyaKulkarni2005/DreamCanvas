'use client';
import { useState } from 'react';
import RoleSelector from '@/app/components/RoleSelector';
// useRouter - a hook from Next.js that allows you to programmatically navigate between pages
import { useRouter } from 'next/navigation';

export default function AnalyzePage() {
  // initializing the router to navigate between pages
  const router = useRouter();
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('');
  // loading state to show a loading indicator while the roadmap is being generated
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  // prevent the default form submission behavior
  // This is important to prevent the page from reloading
  e.preventDefault();

  if (!skills || !role) {
    return alert("Please fill in all fields");
  }

  setLoading(true);

  try {
    // Sending a POST request to the API endpoint to generate the roadmap
    // The request body contains the user's skills and target role
    const res = await fetch('/api/generate-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills, role }),
    });
    // data - the response from the API
    const data = await res.json();
// Check if the response contains an error or if the roadmap is missing
    if (data.error) {
      throw new Error(data.error);
    }
    // Check if the response contains a valid roadmap
    if (!data.roadmap) {
      throw new Error('Invalid response format received.');
    }
// storing the roadmap and missing skills in localStorage
    // This allows the roadmap to be accessed later on the roadmap page
    localStorage.setItem('roadmap', JSON.stringify(data.roadmap));
    localStorage.setItem('missingSkills', JSON.stringify(data.missingSkills));
    localStorage.setItem('targetRole', role);
// Redirecting the user to the roadmap page after successful generation
// push - a method from the useRouter hook to navigate to a different page
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
  className={`bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 ${
    loading ? 'opacity-50 cursor-not-allowed' : ''
  }`}
  disabled={loading}
>
  {loading ? "Generating..." : "Generate Roadmap"}
</button>

      </form>
    </div>
  );
}
