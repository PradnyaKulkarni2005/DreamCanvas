'use client'
import { roles } from '@/app/libs/roles';
// Interface - like blueprint that describes what properties a component or object should have
// here ,RoleSelectorProps is an interface which expects two props: 1. value (string) and 2. onChange (function that takes a string and returns void)
// This interface helps ensure that the component receives the correct type of props, making it easier to
interface RoleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}
// RoleSelector component - a reusable component that allows users to select a role from a dropdown list
// It takes two props: value (the currently selected role) and onChange (a function that updates the selected role)
export default function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Select Target Role</label>
      <select
        className="p-2 border rounded-md"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Select a role --</option>
        {roles.map((role) => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
    </div>
  );
}
