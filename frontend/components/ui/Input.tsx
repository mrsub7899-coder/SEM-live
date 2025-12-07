import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = "", ...props }) => (
  <div className="mb-4">
    {label && <label className="block mb-1 font-medium">{label}</label>}
    <input
      {...props}
      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 ${className}`}
    />
  </div>
);
