'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Cog8ToothIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isLoading) {
    return (
         <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
               <span className="text-2xl font-bold">Examind</span>
               <div className="h-6 w-20 bg-blue-500 animate-pulse rounded"></div>
            </div>
         </nav>
    );
  }
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold flex items-center">
          <Image src="/apple-icon.png" alt="Examind Logo" width={40} height={40} className="mr-2" />
          Examind
        </div>
        <div className="hidden lg:flex items-center space-x-4">
          {isAuthenticated && (
            <>
              {user?.Role !== 'admin' && user?.Role !== 'teacher' && (
                <Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              )}
              <Link href="/quizzes" className="hover:text-blue-200">Quizzes</Link>
              <Link href="/resources" className="hover:text-blue-200">Resources</Link>
              <Link href="/discussions" className="hover:text-blue-200">Discussions</Link>
              <Link href="/challenges" className="hover:text-blue-200">Challenges</Link>
              <Link href="/leaderboard" className="hover:text-blue-200">Leaderboard</Link>
            </>
          )}

          {user?.Role === 'admin' && (
            <Link href="/admin" className="hover:text-yellow-300 flex items-center text-sm bg-yellow-500 px-2 py-1 rounded">
              <Cog8ToothIcon className="w-4 h-4 mr-1"/> Admin Panel
            </Link>
          )}

          {user?.Role === 'teacher' && (
            <Link href="/teacher" className="hover:text-yellow-300 flex items-center text-sm bg-green-500 px-2 py-1 rounded">
              <Cog8ToothIcon className="w-4 h-4 mr-1"/> Teacher Panel
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link href="/profile" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 text-sm">
                {user?.Name || 'Profile'}
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="text-blue-200 hover:text-white transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-200">Login</Link>
              <Link href="/register" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 text-sm">Register</Link>
            </>
          )}
        </div>
        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden mt-4">
          {isAuthenticated && (
            <>
              {user?.Role !== 'admin' && user?.Role !== 'teacher' && (
                <Link href="/dashboard" className="block py-2 hover:text-blue-200">Dashboard</Link>
              )}
              <Link href="/quizzes" className="block py-2 hover:text-blue-200">Quizzes</Link>
              <Link href="/resources" className="block py-2 hover:text-blue-200">Resources</Link>
              <Link href="/discussions" className="block py-2 hover:text-blue-200">Discussions</Link>
              <Link href="/challenges" className="block py-2 hover:text-blue-200">Challenges</Link>
              <Link href="/leaderboard" className="block py-2 hover:text-blue-200">Leaderboard</Link>
            </>
          )}

          {user?.Role === 'admin' && (
            <Link href="/admin" className="block py-2 hover:text-yellow-300">Admin Panel</Link>
          )}

          {user?.Role === 'teacher' && (
            <Link href="/teacher" className="block py-2 hover:text-green-300">Teacher Panel</Link>
          )}

          {isAuthenticated ? (
            <>
              <Link href="/profile" className="block py-2 text-yellow-300 hover:text-yellow-400">{user?.Name || 'Profile'}</Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 hover:text-blue-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 hover:text-blue-200">Login</Link>
              <Link href="/register" className="block py-2 hover:text-blue-200">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
