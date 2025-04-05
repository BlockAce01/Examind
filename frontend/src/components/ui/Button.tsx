// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode; // The text or icon inside the button
  variant?: 'primary' | 'secondary'; // Optional style variants
  fullWidth?: boolean; // Optional prop to make button take full width
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary', // Default to 'primary' style
  fullWidth = false,
  className, // Allow passing additional custom classes
  ...props
}) => {
  // Base styles
  let baseStyle = "font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out";

  // Variant styles
  let variantStyle = '';
  if (variant === 'primary') {
    variantStyle = 'bg-blue-600 hover:bg-blue-700 text-white';
  } else if (variant === 'secondary') {
    variantStyle = 'bg-gray-500 hover:bg-gray-600 text-white';
  }
  // Add more variants later if needed (e.g., 'outline', 'danger')

  // Full width style
  const fullWidthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${fullWidthStyle} ${className || ''}`} // Combine styles, including any passed className
      {...props} // Spread other button props (like type="submit", onClick)
    >
      {children}
    </button>
  );
};

export default Button;