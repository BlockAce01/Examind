// src/app/dashboard/page.tsx
import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import QuickLinkCard from '@/components/dashboard/QuickLinkCard';
// Import some icons from Heroicons (adjust paths as needed)
import {
  AcademicCapIcon, // For Quizzes
  BookOpenIcon,    // For Resources
  ChatBubbleLeftRightIcon, // For Discussions
  TrophyIcon,      // For Points/Rewards
  SparklesIcon,    // For Badges (example)
  ClipboardDocumentListIcon // Example for Challenges
} from '@heroicons/react/24/outline';

// Mock data - replace with actual user data later
const userData = {
  name: "Kamal", // Replace with dynamic data eventually
  points: 1250,
  badges: ["Achiever", "Quick Learner"], // Or count them: userData.badges.length
  quizzesTaken: 15,
};

export default function DashboardPage() {
  return (
    <div>
      {/* Welcome Header */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome back, {userData.name}!
      </h1>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Points"
          value={userData.points}
          icon={<TrophyIcon className="w-8 h-8 text-yellow-500" />}
          colorClass="bg-yellow-50"
        />
         <StatCard
          title="Badges Earned"
          value={userData.badges.length} // Displaying the count for simplicity
          icon={<SparklesIcon className="w-8 h-8 text-indigo-500" />}
           colorClass="bg-indigo-50"
        />
         <StatCard
          title="Quizzes Taken"
          value={userData.quizzesTaken}
           icon={<AcademicCapIcon className="w-8 h-8 text-green-500" />}
           colorClass="bg-green-50"
        />
        {/* Add more StatCards as needed (e.g., Challenges Completed) */}
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
          href="/challenges" // We need to create this page later
          icon={<ClipboardDocumentListIcon className="w-6 h-6" />}
        />
         <QuickLinkCard
          title="Check Leaderboard"
          description="See where you rank among other students."
          href="/leaderboard" // We need to create this page later
          icon={<TrophyIcon className="w-6 h-6" />}
        />
         <QuickLinkCard
            title="My Profile"
            description="View your progress, achievements, and settings."
            href="/profile"
            icon={<TrophyIcon className="w-6 h-6" />} // Placeholder Icon - find a better one
        />
        {/* Add more QuickLinkCards as needed */}
      </div>

      {/* Placeholder for Future Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md min-h-[200px]">
              <h3 className="text-xl font-semibold mb-3 text-gray-700">Recent Activity</h3>
              <p className="text-gray-500 text-sm">Your recent quiz attempts and forum interactions will appear here...</p>
              {/* List items would go here later */}
          </div>
           <div className="bg-white p-6 rounded-lg shadow-md min-h-[200px]">
              <h3 className="text-xl font-semibold mb-3 text-gray-700">Leaderboard Snapshot</h3>
               <p className="text-gray-500 text-sm">Top 5 students will be shown here...</p>
               {/* Leaderboard list would go here later */}
           </div>
      </div>

    </div>
  );
}