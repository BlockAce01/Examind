'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ArrowLeftOnRectangleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

const teacherNavLinks = [
  { name: 'Manage Quizzes', href: '/teacher/quizzes', icon: QuestionMarkCircleIcon },
  { name: 'Add Quiz', href: '/teacher/quizzes/new', icon: QuestionMarkCircleIcon },
  { name: 'Manage Resources', href: '/teacher/resources', icon: BookOpenIcon },
  { name: 'Add Resource', href: '/teacher/resources/new', icon: BookOpenIcon },
];

const TeacherSidebar = () => {
  const pathname = usePathname(); // Get the current URL path
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-gray-800 text-gray-300 flex flex-col min-h-screen">
      {/* Header */}
      <div className="h-16 flex items-center justify-center bg-gray-900">
         <Link href="/teacher" className='flex items-center gap-2'>
             <AcademicCapIcon className="w-8 h-8 text-blue-400"/>
             <span className="text-xl font-semibold text-white">Examind Teacher</span>
         </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {teacherNavLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/teacher' && pathname.startsWith(link.href)); // Check if link is active
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
         <button onClick={logout} className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white w-full">
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3"/>
            <span>Logout</span>
         </button>
      </div>
    </aside>
  );
};

export default TeacherSidebar;
