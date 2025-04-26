import React from 'react';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'; 

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message: string;
  action?: React.ReactNode; 
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <DocumentMagnifyingGlassIcon className="h-12 w-12 text-gray-400" />,
  title = "Nothing Found",
  message,
  action
}) => {
  return (
    <div className="text-center p-10 border border-dashed border-gray-300 rounded-lg bg-gray-50 my-6">
      <div className="mx-auto mb-3 w-fit"> {/* Center the icon */}
         {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;