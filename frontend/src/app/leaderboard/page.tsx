"use client";

import React, { useEffect, useState } from 'react';

interface User {
  UserID: number;
  Name: string;
  Points: number;
}

const LeaderboardPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/api/v1/users/ranked`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data.data.users);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <ul className="space-y-2">
        {users.map((user, index) => (
          <li key={user.UserID} className="flex justify-between items-center bg-gray-100 p-3 rounded">
            <span className="font-semibold">{index + 1}. {user.Name}</span>
            <span className="text-gray-700">{user.Points} points</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardPage;
