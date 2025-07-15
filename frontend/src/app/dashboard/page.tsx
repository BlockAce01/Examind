'use client';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StatCard from '@/components/dashboard/StatCard';
import QuickLinkCard from '@/components/dashboard/QuickLinkCard';
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { getUserStats, getRankedUsers, getRecentActivity } from '@/lib/api'; // Import the API functions

interface Activity {
  type: 'quiz' | 'discussion';
  title: string;
  timestamp: string;
}

interface LeaderboardUser {
  UserID: number;
  Name: string;
  Points: number;
}

export default function DashboardPageWrapper() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}

function DashboardPageContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    points: 0,
    badges: 0,
    quizzesCompleted: 0,
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (user?.userId) {
      const fetchStats = async () => {
        try {
          const data = await getUserStats(user.userId);
          setStats(data.data);
        } catch (error) {
          console.error('Failed to fetch user stats', error);
        }
      };
      const fetchLeaderboard = async () => {
        try {
          const data = await getRankedUsers();
          setLeaderboard(data.data.users.slice(0, 5));
        } catch (error) {
          console.error('Failed to fetch leaderboard', error);
        }
      };
      const fetchActivities = async () => {
        try {
          const data = await getRecentActivity(user.userId);
          setActivities(data.data.activities);
        } catch (error) {
          console.error('Failed to fetch recent activities', error);
        }
      };
      fetchStats();
      fetchLeaderboard();
      fetchActivities();
    }
  }, [user]);

  const displayName = user?.name ?? 'User';

  return (
    <div>
      {/* Welcome Header */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome back, {displayName}!
      </h1>

      {/* Stats Overview  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Points"
          value={stats.points}
          icon={<TrophyIcon className="w-8 h-8 text-yellow-500" />}
          colorClass="bg-yellow-50"
        />
        <StatCard
          title="Badges Earned"
          value={stats.badges}
          icon={<SparklesIcon className="w-8 h-8 text-indigo-500" />}
          colorClass="bg-indigo-50"
        />
        <StatCard
          title="Quizzes Taken"
          value={stats.quizzesCompleted}
          icon={<AcademicCapIcon className="w-8 h-8 text-green-500" />}
          colorClass="bg-green-50"
        />
      </div>

      {/* Quick Links Section */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Explore Examind</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <QuickLinkCard
          title="Take a Quiz"
          description="Test your knowledge with interactive quizzes."
          href="/quizzes"
          icon={<AcademicCapIcon className="w-6 h-6" />}
        />
        <QuickLinkCard
          title="Browse Resources"
          description="Access past papers, notes, and study materials."
          href="/resources"
          icon={<BookOpenIcon className="w-6 h-6" />}
        />
         <QuickLinkCard
          title="Join Discussions"
          description="Collaborate with peers and ask questions."
          href="/discussions"
          icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />}
        />
         <QuickLinkCard
          title="View Challenges"
          description="Complete challenges and earn extra points."
          href="/challenges"
          icon={<ClipboardDocumentListIcon className="w-6 h-6" />}
        />
         <QuickLinkCard
          title="Check Leaderboard"
          description="See where you rank among other students."
          href="/leaderboard"
          icon={<TrophyIcon className="w-6 h-6" />}
        />
         <QuickLinkCard
            title="My Profile"
            description="View your progress, achievements, and settings."
            href="/profile"
            icon={<TrophyIcon className="w-6 h-6" />} 
        />
      </div>

      {/* Future Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[200px]">
          <h3 className="text-xl font-semibold mb-3 text-gray-700">Recent Activity</h3>
          {activities.length > 0 ? (
            <ul>
              {activities.map((activity, index) => (
                <li key={index} className="flex items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div className="mr-3">
                    {activity.type === 'quiz' ? (
                      <AcademicCapIcon className="w-6 h-6 text-green-500" />
                    ) : (
                      <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-800">{activity.title}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Your recent quiz attempts and forum interactions will appear here...</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[200px]">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Leaderboard Snapshot</h3>
            {leaderboard.length > 0 ? (
              <ul>
                {leaderboard.map((user, index) => (
                  <li key={user.UserID} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span className="font-semibold">{index + 1}. {user.Name}</span>
                    <span className="text-gray-600">{user.Points} pts</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Top 5 students will be shown here...</p>
            )}
          </div>
      </div>

    </div>
  );
}
