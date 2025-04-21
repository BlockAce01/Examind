import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string; // <-- Make sure this line exists and 'error' is lowercase
}

const Input: React.FC<InputProps> = ({ label, id, error, ...props }) => {
  return (
    <div className="mb-3">
      <label
        htmlFor={id}
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        
        className={`shadow appearance-none border ${error ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-300' : 'focus:ring-blue-500'} focus:border-transparent`}
       
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      <div className="h-4 mt-1">
         {/* Check that 'error' (lowercase) is used here */}
         {error && (
           <p id={`${id}-error`} className="text-xs text-red-600">
               {error}
           </p>
          )}
      </div>
    </div>
  );
};

export default Input;