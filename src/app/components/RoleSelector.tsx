'use client';
import { roles } from '@/app/libs/roles'; // import the roles array from the roles module
import './inputfield.css'; // the custom select styles

export default function RoleSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="select">
      <div
        className="selected"
        data-default="Select Role"
        {...roles.reduce(
          (acc, role, i) => ({ ...acc, [`data-${i + 1}`]: role }),
          {}
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
          className="arrow"
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
        </svg>
      </div>

      <div className="options">
        <div title="default">
          <input id="all" name="role" type="radio" defaultChecked />
          <label
            className="option"
            htmlFor="all"
            data-txt="Select Role"
            onClick={() => onChange('')}
          />
        </div>

        {roles.map((role, index) => (
          <div key={role} title={role}>
            <input id={`role-${index}`} name="role" type="radio" />
            <label
              className="option"
              htmlFor={`role-${index}`}
              data-txt={role}
              onClick={() => onChange(role)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
