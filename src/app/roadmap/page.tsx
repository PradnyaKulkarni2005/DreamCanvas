'use client';
import { useEffect, useState } from 'react';

interface DayPlan {
  day: number;
  topic: string;
}

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<DayPlan[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('roadmap');
    const skills = localStorage.getItem('missingSkills');
    const target = localStorage.getItem('targetRole');

    if (stored) setRoadmap(JSON.parse(stored));
    if (skills) setMissingSkills(JSON.parse(skills));
    if (target) setRole(target);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Roadmap to Become a {role}</h1>

      <p className="mb-4">
        <strong>Skills to Learn:</strong> {missingSkills.join(', ')}
      </p>

      <div className="space-y-4">
        {roadmap.map((item) => (
          <div key={item.day} className="bg-gray-100 p-4 rounded shadow">
            <p className="font-semibold">Day {item.day}</p>
            <p>{item.topic}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
