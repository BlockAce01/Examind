'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/dashboard/StatCard';
import Button from '@/components/ui/Button';
import { UserCircleIcon, AcademicCapIcon, SparklesIcon, TrophyIcon, Cog6ToothIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Badge from '@/components/ui/Badge';
import { Badge as BadgeType } from '@/types/user';

export default function ProfilePageWrapper() {
    return (
        <ProtectedRoute>
            <ProfilePageContent />
        </ProtectedRoute>
    );
}

function ProfilePageContent() {
    const { user: currentUser, token } = useAuth();
    const [stats, setStats] = useState({
        points: 0,
        badges: 0,
        quizzesCompleted: 0,
    });
    const [badges, setBadges] = useState<BadgeType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser && currentUser.UserID && token) {
            const fetchData = async () => {
                try {
                    //fetch stats
                    const statsResponse = await axios.get(`http://localhost:3001/api/v1/users/${currentUser.UserID}/stats`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setStats(statsResponse.data.data);

                    //trigger badge check
                    await axios.post(`http://localhost:3001/api/v1/users/${currentUser.UserID}/badges/check`, {}, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    //fetch badges
                    const badgesResponse = await axios.get(`http://localhost:3001/api/v1/users/${currentUser.UserID}/badges`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setBadges(badgesResponse.data.data);

                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [currentUser, token]);

    if (!currentUser) {
        return <div className="text-center p-10 text-gray-500">Loading user data...</div>;
    }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Info */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full"> {/* Added overflow-hidden and moved rounded-full here */}
    {currentUser.AvatarURL ? (
        <Image
            src={currentUser.AvatarURL}
            alt={`${currentUser.Name}'s avatar`}
            fill 
            className="object-cover" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
        />
    ) : (
        <UserCircleIcon className="w-24 h-24 text-gray-400" />
    )}
</div>
          <h2 className="text-xl font-semibold text-gray-900">{currentUser.Name ?? 'User Name'}</h2>
          <p className="text-sm text-gray-500 mb-1">{currentUser.Email ?? 'No email provided'}</p>
          <span className={`capitalize text-xs font-medium px-2 py-0.5 rounded-full ${
              currentUser.Role === 'admin' ? 'bg-red-100 text-red-800' :
              currentUser.Role === 'teacher' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
          }`}>
            {currentUser.Role ?? 'N/A'}
          </span>
          <br />
           <Button variant="secondary" className="mt-4 text-xs">Edit Profile</Button> 
        </div>

        {/* Right Column: Stats and Settings */}
        <div className="md:col-span-2 space-y-6">
          {/* Achievements */}
          {currentUser.Role === 'student' && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Achievements</h3>
                  {loading ? (
                      <div className="text-center text-gray-500">Loading stats...</div>
                  ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <StatCard title="Points" value={stats.points} icon={<TrophyIcon className="w-6 h-6 text-yellow-500" />} />
                          <StatCard title="Badges" value={stats.badges} icon={<SparklesIcon className="w-6 h-6 text-indigo-500" />} />
                          <StatCard title="Quizzes Done" value={stats.quizzesCompleted} icon={<AcademicCapIcon className="w-6 h-6 text-green-500" />} />
                      </div>
                  )}
              </div>
          )}

          {/* Badges */}
          {currentUser.Role === 'student' && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">My Badges</h3>
                  {loading ? (
                      <div className="text-center text-gray-500">Loading badges...</div>
                  ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {badges.map((badge) => (
                              <Badge key={badge.BadgeID} {...badge} />
                          ))}
                      </div>
                  )}
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
        </div>
      </div>
    </div>
  );
}
