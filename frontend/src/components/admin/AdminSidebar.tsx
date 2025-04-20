// src/components/admin/AdminSidebar.tsx
'use client'; // Needed for hooks like usePathname

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook to get current path
import {
  ChartBarIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const adminNavLinks = [
  { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
  { name: 'Manage Quizzes', href: '/admin/quizzes', icon: QuestionMarkCircleIcon },
  { name: 'Manage Resources', href: '/admin/resources', icon: BookOpenIcon },
  { name: 'Manage Discussions', href: '/admin/discussions', icon: ChatBubbleLeftRightIcon },
  { name: 'Manage Users', href: '/admin/users', icon: UsersIcon }, // Added User management placeholder
];

const AdminSidebar = () => {
  const pathname = usePathname(); // Get the current URL path

  return (
    <aside className="w-64 bg-gray-800 text-gray-300 flex flex-col min-h-screen">
      {/* Logo/Header */}
      <div className="h-16 flex items-center justify-center bg-gray-900">
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