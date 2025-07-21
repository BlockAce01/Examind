'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const adminNavLinks = [
  { name: 'Manage Quizzes', href: '/admin/quizzes', icon: QuestionMarkCircleIcon },
  { name: 'Manage Resources', href: '/admin/resources', icon: BookOpenIcon },
  { name: 'Manage Discussions', href: '/admin/discussions', icon: ChatBubbleLeftRightIcon },
  { name: 'Manage Users', href: '/admin/users', icon: UsersIcon },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname(); // Get the current URL path

  return (
    <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-800 text-gray-300 flex-col min-h-screen transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:flex`}>
      {/* Logo/Header */}
      <div className="h-16 flex items-center justify-between bg-gray-900 px-4">
         <Link href="/admin" className='flex items-center gap-2'>
             <AcademicCapIcon className="w-8 h-8 text-blue-400"/>
             <span className="text-xl font-semibold text-white">Examind Admin</span>
         </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {adminNavLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href)); // Check if link is active
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                                  ${isActive
                                      ? 'bg-gray-700 text-white' // Active style
                                      : 'text-gray-400 hover:bg-gray-700 hover:text-white' // Inactive style
                                  }`}
            >
              <link.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-300' : ''}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer/Logout (Placeholder) */}
      <div className="p-4 border-t border-gray-700">
         <Link href="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3"/>
            <span>Back to Site</span> {/* Or Logout Button */}
         </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
