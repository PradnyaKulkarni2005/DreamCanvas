'use client';
import { useEffect, useState } from 'react';
//interface - like a blueprint for an object
// This interface defines the structure of each roadmap item
//  for the roadmap item
interface DayPlan {
  day: number;
  topic: string;
  subtasks: string[];
}
// This component displays the user's personalized roadmap
// It retrieves the roadmap data from localStorage and displays it
export default function RoadmapPage() {
  // useState is a React hook that allows you to add state to functional components
  // It returns an array with the current state and a function to update it
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
        {/* mapping through the roadmap array and display each item */}
        {roadmap.map((item) => (
          <div key={item.day} className="bg-gray-100 p-4 rounded shadow">
            <p className="font-semibold">Day {item.day}: {item.topic}</p>
            <ul className="list-disc list-inside mt-2 ml-4 text-sm text-gray-700">
              {item.subtasks.map((task, idx) => (
                <li key={idx}>{task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
