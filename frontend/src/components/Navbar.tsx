'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Cog8ToothIcon, ArrowRightOnRectangleIcon} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth(); 

  if (isLoading) {
    return (
         <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
               <span className="text-2xl font-bold">Examind</span>
               <div className="h-6 w-20 bg-blue-500 animate-pulse rounded"></div> {/* Placeholder */}
            </div>
         </nav>
    );
  }
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {}
        <Link href={isAuthenticated ? "/dashboard" : "/app"} className="text-2xl font-bold hover:text-blue-200 flex items-center">
          <Image src="/apple-icon.png" alt="Examind Logo" width={40} height={40} className="mr-2" />
          Examind
        </Link>

        <div className="space-x-4 flex items-center"> {/* Use flex items-center */}
          {/* Links visible to logged-in users */}
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              <Link href="/quizzes" className="hover:text-blue-200 hidden sm:inline-block">Quizzes</Link> {/* Hide on xs */}              
              <Link href="/resources" className="hover:text-blue-200">Resources</Link>
              <Link href="/discussions" className="hover:text-blue-200 hidden md:inline-block">Discussions</Link> {/* Hide on xs, sm */} 
              <Link href="/challenges" className="hover:text-blue-200 hidden lg:inline-block">Challenges</Link> {/* Hide on xs, sm, md */}
              <Link href="/leaderboard" className="hover:text-blue-200 hidden sm:inline-block">Leaderboard</Link> {/* Hide on xs */}            
            </>
          )}

           {/* admin specific link */}
           {user?.role === 'admin' && (
              <Link href="/admin" className="hover:text-yellow-300 flex items-center text-sm bg-yellow-500 px-2 py-1 rounded">
                  <Cog8ToothIcon className="w-4 h-4 mr-1"/> Admin Panel
              </Link>
           )}

          {/* Conditional Login/Register/Profile Links */}
          {isAuthenticated ? (
            <> {/* Group Profile and Logout */}
             <Link href="/profile" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 text-sm">
               {user?.name || 'Profile'} {/* Show user name or 'Profile' */}
             </Link>
             {/* Add Logout Button */}
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
      </div>
    </nav>
  );
};

export default Navbar;
