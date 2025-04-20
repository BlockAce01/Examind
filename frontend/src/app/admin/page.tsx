// src/app/admin/page.tsx
import React from 'react';
import Link from 'next/link';
import { mockUsers } from '@/data/mockUsers'; // Example data import
import { mockQuizzes } from '@/data/mockQuizzes';
import { mockResources } from '@/data/mockResources';
import StatCard from '@/components/dashboard/StatCard'; // Reuse StatCard
import { UsersIcon, QuestionMarkCircleIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export default function AdminDashboardPage() {
    // Fetch or calculate stats (using mock data counts here)
    const totalUsers = mockUsers.length;
    const totalQuizzes = mockQuizzes.length;
    const totalResources = mockResources.length;

    return (
        <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Users" value={totalUsers} icon={<UsersIcon className="w-8 h-8 text-blue-500"/>} colorClass='bg-blue-50'/>
            <StatCard title="Total Quizzes" value={totalQuizzes} icon={<QuestionMarkCircleIcon className="w-8 h-8 text-green-500"/>} colorClass='bg-green-50'/>
            <StatCard title="Total Resources" value={totalResources} icon={<BookOpenIcon className="w-8 h-8 text-purple-500"/>} colorClass='bg-purple-50'/>
        </div>

         {/* Quick Actions (Optional) */}
         <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Actions</h2>
         <div className="flex flex-wrap gap-4">
             <Link href="/admin/quizzes/new">
                 <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                     + Add New Quiz
                 </button>
             </Link>
              <Link href="/admin/resources/new">
                 <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                     + Add New Resource
                 </button>
             </Link>
             {/* Add more quick action links */}
         </div>

        {/* Placeholder for recent activity or system status */}
        </div>
    );
}