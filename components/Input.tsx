import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="mb-3">
      {label && <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>}
      <div className="relative">
        <input
          className={`w-full bg-[#f0f5f0] border border-gray-300 rounded-md px-3 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4caf50] focus:border-transparent transition-all ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;