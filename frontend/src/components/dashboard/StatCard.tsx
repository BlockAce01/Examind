import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode; 
  colorClass?: string; 
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  colorClass = 'bg-white', // Default background
}) => {
  return (
    <div className={`${colorClass} p-6 rounded-lg shadow-md flex items-center space-x-4`}>
      {icon && <div className="text-3xl">{icon}</div>} {/* Render icon if provided */}
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;