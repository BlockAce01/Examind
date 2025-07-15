'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StatChart from '@/components/teacher/StatChart';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

// Helper to generate random colors for charts
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

interface StatData {
    [key: string]: any;
}

export default function TeacherDashboardPage() {
    const [quizStats, setQuizStats] = useState<{ subjectStats: StatData[], difficultyStats: StatData[] } | null>(null);
    const [resourceStats, setResourceStats] = useState<{ resourceTypeStats: StatData[] } | null>(null);
    const [discussionStats, setDiscussionStats] = useState<{ discussionStats: StatData[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;
            setIsLoading(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const headers = { 'Authorization': `Bearer ${token}` };

                const [quizRes, resourceRes, discussionRes] = await Promise.all([
                    fetch(`${apiUrl}/api/v1/stats/quizzes`, { headers }),
                    fetch(`${apiUrl}/api/v1/stats/resources`, { headers }),
                    fetch(`${apiUrl}/api/v1/stats/discussions`, { headers }),
                ]);

                if (!quizRes.ok || !resourceRes.ok || !discussionRes.ok) {
                    throw new Error('Failed to fetch all statistics');
                }

                const quizData = await quizRes.json();
                const resourceData = await resourceRes.json();
                const discussionData = await discussionRes.json();

                setQuizStats(quizData.data);
                setResourceStats(resourceData.data);
                setDiscussionStats(discussionData.data);
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching statistics.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [token]);

    const formatChartData = (data: StatData[], labelField: string, dataField: string) => {
        if (!data || !Array.isArray(data)) return null;
        const labels = data.map(item => item[labelField]);
        const chartData = data.map(item => item[dataField]);
        const backgroundColors = data.map(() => getRandomColor());

        return {
            labels,
            datasets: [{
                data: chartData,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => `${color}B3`),
                borderWidth: 1,
            }],
        };
    };

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Teacher Dashboard</h1>

            {/* Quick Actions */}
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Actions</h2>
            <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/teacher/quizzes/new">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        + Add New Quiz
                    </button>
                </Link>
                <Link href="/teacher/resources/new">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        + Add New Resource
                    </button>
                </Link>
            </div>

            {/* Content Overview Section */}
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Content Overview</h2>
            {isLoading ? (
                <div className="flex justify-center p-10"><Spinner size="lg" /></div>
            ) : error ? (
                <div className="text-center p-6 text-red-600 bg-red-50 border border-red-200 rounded-lg">Error: {error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizStats && quizStats.subjectStats && (
                        <StatChart data={formatChartData(quizStats.subjectStats, 'Subject', 'count')!} title="Quizzes by Subject" />
                    )}
                    {quizStats && quizStats.difficultyStats && (
                        <StatChart data={formatChartData(quizStats.difficultyStats, 'DifficultyLevel', 'count')!} title="Quizzes by Difficulty" />
                    )}
                    {resourceStats && resourceStats.resourceTypeStats && (
                        <StatChart data={formatChartData(resourceStats.resourceTypeStats, 'Type', 'count')!} title="Resources by Type" />
                    )}
                    {/* {discussionStats && discussionStats.discussionStats && (
                        <StatChart data={formatChartData(discussionStats.discussionStats, 'Name', 'postCount')!} title="Discussion Contributions" />
                    )} */}
                </div>
            )}
        </div>
    );
}
