'use client'
import { useEffect, useState } from 'react';

export default function RoadmapPage() {
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    setSkills(localStorage.getItem('userSkills') || '');
    setRole(localStorage.getItem('targetRole') || '');
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Personalized Roadmap</h1>
      <p><strong>Target Role:</strong> {role}</p>
      <p><strong>Your Skills:</strong> {skills}</p>

      <div className="mt-4 space-y-4">
        <div className="bg-gray-100 p-4 rounded-md shadow">
          <p className="font-semibold">Day 1</p>
          <p>Review JavaScript fundamentals</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-md shadow">
          <p className="font-semibold">Day 2</p>
          <p>Dive into React hooks</p>
        </div>
      </div>
    </div>
  );
}
