'use client';
import { roles } from '@/app/libs/roles'; // import the roles array from the roles module
import { useState } from 'react';

export default function RoleSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (role: string) => {
    onChange(role);
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-[#1f2937] text-white font-medium py-3 px-5 rounded-xl shadow-md flex justify-between items-center hover:bg-[#111827] transition duration-300"
      >
        <span>{value || 'Select Role'}</span>
        <svg
          className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.353a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <ul
          className="absolute z-10 mt-2 w-full bg-[#1f2937] border border-gray-700 rounded-xl shadow-lg max-h-60 overflow-auto animate-fade-in-up"
        >
          <li
            className="px-4 py-2 text-gray-300 hover:bg-emerald-600 hover:text-white cursor-pointer rounded-t-xl"
            onClick={() => handleSelect('')}
          >
            Select Role
          </li>
          {roles.map((role) => (
            <li
              key={role}
              className={`px-4 py-2 cursor-pointer text-sm hover:bg-emerald-600 hover:text-white ${
                role === value ? 'bg-emerald-700 text-white' : 'text-gray-300'
              }`}
              onClick={() => handleSelect(role)}
            >
              {role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
