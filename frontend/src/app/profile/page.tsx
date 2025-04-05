// src/app/profile/page.tsx
'use client'; // Need this for the simulated user fetching (will use hooks later for real auth)

import React from 'react';
import Image from 'next/image'; // Use Next.js Image for optimized images
import { getMockLoggedInUser, type User } from '@/data/mockUsers'; // Import our mock user logic
import StatCard from '@/components/dashboard/StatCard'; // Reuse StatCard
import Button from '@/components/ui/Button';
import { UserCircleIcon, EnvelopeIcon, AcademicCapIcon, SparklesIcon, TrophyIcon, Cog6ToothIcon, LockClosedIcon } from '@heroicons/react/24/outline';

// --- Simulate different roles easily ---
// Change this value ('student', 'teacher', 'admin') to see different views
const SIMULATED_ROLE: 'student' | 'teacher' | 'admin' = 'student';
// --------------------------------------

export default function ProfilePage() {
  // Simulate fetching logged-in user data - REPLACE with real auth context later
  const currentUser: User | undefined = getMockLoggedInUser(SIMULATED_ROLE);

  // Mock profile stats - fetch these properly later
  const profileStats = {
      points: SIMULATED_ROLE === 'teacher' ? 'N/A' : 1250, // Teachers might not have points
      badges: SIMULATED_ROLE === 'teacher' ? 0 : 2,
      quizzesCompleted: SIMULATED_ROLE === 'teacher' ? 'N/A' : 15,
  };

  if (!currentUser) {
    // Handle case where user data couldn't be loaded (e.g., redirect to login)
    // For now, just show a message
    return <div className="text-center p-10 text-red-500">User not found. Please log in.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Info */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full"> {/* Added overflow-hidden and moved rounded-full here */}
    {currentUser.avatarUrl ? (
        <Image
            src={currentUser.avatarUrl}
            alt={`${currentUser.name}'s avatar`}
            fill // <-- MODERN prop for filling the parent
            className="object-cover" // <-- MODERN way using Tailwind class
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optional: Provide sizes prop for better optimization
        />
    ) : (
        <UserCircleIcon className="w-24 h-24 text-gray-400" />
    )}
</div>
          <h2 className="text-xl font-semibold text-gray-900">{currentUser.name}</h2>
          <p className="text-sm text-gray-500 mb-1">{currentUser.email || 'No email provided'}</p>
          <span className={`capitalize text-xs font-medium px-2 py-0.5 rounded-full ${
              currentUser.role === 'admin' ? 'bg-red-100 text-red-800' :
              currentUser.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
          }`}>
            {currentUser.role}
          </span>
           <Button variant="secondary" size="sm" className="mt-4 text-xs">Edit Profile</Button> {/* Placeholder */}
        </div>

        {/* Right Column: Stats and Settings */}
        <div className="md:col-span-2 space-y-6">
          {/* Achievements/Stats Section */}
          {currentUser.role === 'student' && ( // Only show stats for students (example)
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Achievements</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <StatCard title="Points" value={profileStats.points} icon={<TrophyIcon className="w-6 h-6 text-yellow-500"/>} />
                      <StatCard title="Badges" value={profileStats.badges} icon={<SparklesIcon className="w-6 h-6 text-indigo-500"/>} />
                      <StatCard title="Quizzes Done" value={profileStats.quizzesCompleted} icon={<AcademicCapIcon className="w-6 h-6 text-green-500"/>} />
                  </div>
                  {/* Add link to view all badges/achievements page later */}
              </div>
          )}

           {/* Settings Section */}
           <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Settings</h3>
                <div className="space-y-3">
                    <button className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center text-sm text-gray-600">
                        <Cog6ToothIcon className="w-4 h-4 mr-2"/> Account Preferences
                    </button>
                    <button className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center text-sm text-gray-600">
                        <LockClosedIcon className="w-4 h-4 mr-2"/> Change Password
                    </button>
                    {/* Add more settings */}
                </div>
           </div>

            {/* Placeholder for Activity Feed/Links */}
            {/* <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
               <h3 className="text-lg font-semibold mb-4 text-gray-700">My Activity</h3>
               <p className="text-sm text-gray-500">Links to recent quizzes or posts...</p>
            </div> */}

        </div>
      </div>
    </div>
  );
}