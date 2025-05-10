'use client';
import React from 'react';
import Image from 'next/image';
import ProtectedRoute from '@/components/auth/ProtectedRoute'; // Import ProtectedRoute
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import StatCard from '@/components/dashboard/StatCard';
import Button from '@/components/ui/Button';
import { UserCircleIcon, AcademicCapIcon, SparklesIcon, TrophyIcon, Cog6ToothIcon, LockClosedIcon } from '@heroicons/react/24/outline';


export default function ProfilePageWrapper() { 
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}

function ProfilePageContent() {
  const { user: currentUser } = useAuth(); // Get user from context

  //fetch these properly later or add to user context
  const profileStats = {
      points: currentUser?.role === 'teacher' ? 'N/A' : (currentUser?.points ?? 0), // Use points from context if available
      badges: currentUser?.role === 'teacher' ? 0 : 0, 
      quizzesCompleted: currentUser?.role === 'teacher' ? 'N/A' : 0, 
  };

  // undefined during loading or if not authenticated.
  // We can assume currentUser is available here, if the component renders
  if (!currentUser) {
      // This case should ideally not be reached if ProtectedRoute works correctly,
      // but adding a fallback just in case.
      return <div className="text-center p-10 text-gray-500">Loading user data...</div>;
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
            fill 
            className="object-cover" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
        />
    ) : (
        <UserCircleIcon className="w-24 h-24 text-gray-400" />
    )}
</div>
          <h2 className="text-xl font-semibold text-gray-900">{currentUser.name ?? 'User Name'}</h2>
          <p className="text-sm text-gray-500 mb-1">{currentUser.email ?? 'No email provided'}</p>
          <span className={`capitalize text-xs font-medium px-2 py-0.5 rounded-full ${
              currentUser.role === 'admin' ? 'bg-red-100 text-red-800' :
              currentUser.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
          }`}>
            {currentUser.role ?? 'N/A'}
          </span>
           <Button variant="secondary" className="mt-4 text-xs">Edit Profile</Button> 
        </div>

        {/* Right Column: Stats and Settings */}
        <div className="md:col-span-2 space-y-6">
          {/* Achievements */}
          {currentUser.role === 'student' && ( // Only show stats for students
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Achievements</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <StatCard title="Points" value={profileStats.points} icon={<TrophyIcon className="w-6 h-6 text-yellow-500"/>} />
                      <StatCard title="Badges" value={profileStats.badges} icon={<SparklesIcon className="w-6 h-6 text-indigo-500"/>} />
                      <StatCard title="Quizzes Done" value={profileStats.quizzesCompleted} icon={<AcademicCapIcon className="w-6 h-6 text-green-500"/>} />
                  </div>
                  {/* Add link to view all badges */}
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
