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
    <div className="max-w-3xl mx-auto p-6 text-white animate-fade-in">
      <h1 className="text-3xl font-bold mb-4 text-emerald-400 animate-fade-in-up">
        Your Roadmap to Become a {role}
      </h1>

      <p className="mb-6 text-lg text-gray-300 animate-fade-in-up delay-100">
        <strong className="text-white">Skills to Learn:</strong>{' '}
        {missingSkills.length > 0 ? missingSkills.join(', ') : 'None'}
      </p>

      <div className="space-y-6">
        {/* mapping through the roadmap array and display each item */}
        {roadmap.map((item, index) => (
          <div
            key={item.day}
            className="bg-[#161b22] border border-emerald-700/40 shadow-lg rounded-xl p-6 hover:shadow-emerald-500/30 transition duration-300 transform hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
          >
            <p className="text-xl font-semibold text-emerald-400 mb-2">
              Day {item.day}: <span className="text-white">{item.topic}</span>
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-gray-300 text-sm">
              {item.subtasks.map((task, idx) => (
                <li key={idx} className="hover:text-white transition">{task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
