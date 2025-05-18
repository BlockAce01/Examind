import React from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
    return (
        <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

         {/* Quick Actions */}
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
         </div>

        {/* User Management Section */}
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">User Management</h2>
            <p>User statistics and management links will go here.</p>
            <Link href="/admin/users">
                <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Manage Users
                </button>
            </Link>
        </div>

        {/* Content Overview Section */}
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Content Overview</h2>
            <p>Statistics on discussions, quizzes, and resources will go here.</p>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Activity</h2>
            <p>Feed of recent user and content activity will go here.</p>
        </div>

        </div>
    );
}
