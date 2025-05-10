
import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline'; // Using Heroicons

interface QuickLinkCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
}

const QuickLinkCard: React.FC<QuickLinkCardProps> = ({
  title,
  description,
  href,
  icon,
}) => {
  return (
    <Link href={href} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition duration-150 ease-in-out group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
            {icon && <div className="text-xl text-blue-600">{icon}</div>}
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition duration-150 ease-in-out" />
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
};

export default QuickLinkCard;