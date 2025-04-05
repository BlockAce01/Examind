// src/app/admin/quizzes/page.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Import useEffect
import Link from 'next/link';
// Remove mock data import, keep type from shared location
// import { mockQuizzes as initialQuizzes, type Quiz } from '@/data/mockQuizzes';
import { type QuizListItem } from '@/types/quiz'; // Import shared type
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner'; // Import Spinner
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext'; // Assuming you might use token later

export default function AdminQuizzesPage() {
    const [quizzes, setQuizzes] = useState<QuizListItem[]>([]); // Use shared type
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth(); // Get token if needed for delete

    // --- Fetch Data ---
    const fetchAdminQuizzes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/quizzes`, {
                 headers: { /* Add Auth header if needed */ },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data.status === 'success' && Array.isArray(data.data?.quizzes)) {
                setQuizzes(data.data.quizzes); // Ensure response matches QuizListItem[]
            } else {
                throw new Error(data.message || 'Invalid API response format');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch quizzes.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminQuizzes();
    }, []); // Fetch on mount

    // --- Handle Delete ---
    const handleDelete = async (QuizID: number, Title: string) => { // Use correct casing for ID/Title from state
        if (!token) { /* Handle no token */ return; }
        if (window.confirm(`Are you sure you want to delete the quiz "${Title}"?`)) {
            try {
                setError(null);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/quizzes/${QuizID}`, { // Use QuizID
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.status === 204) {
                    setQuizzes(currentQuizzes => currentQuizzes.filter(q => q.QuizID !== QuizID)); // Use QuizID
                    alert(`Quiz "${Title}" deleted successfully.`);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Failed to delete. Status: ${response.status}`);
                }
            } catch (err: any) {
                setError(err.message || 'Could not delete quiz.');
                alert(`Error deleting quiz: ${err.message}`);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Quizzes</h1>
                <Link href="/admin/quizzes/new">
                    <Button variant="primary" className="bg-green-600 hover:bg-green-700">
                        + Add New Quiz
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                 <div className="flex justify-center p-10"><Spinner size="lg" /></div>
            ) : error ? (
                 <div className="text-center p-6 text-red-600 bg-red-50 border border-red-200 rounded-lg">Error: {error}</div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {quizzes.length > 0 ? (
                                quizzes.map((quiz) => (
                                    <tr key={quiz.QuizID} className="hover:bg-gray-50">
                                        {/* Use correct casing from QuizListItem */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quiz.QuizID}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{quiz.Title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quiz.Subject}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quiz.DifficultyLevel}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quiz.questionCount ?? 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Link href={`/admin/quizzes/edit/${quiz.QuizID}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center" title="Edit">
                                                <PencilSquareIcon className="w-4 h-4"/>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(quiz.QuizID, quiz.Title)}
                                                className="text-red-600 hover:text-red-900 inline-flex items-center"
                                                title="Delete"
                                            >
                                                <TrashIcon className="w-4 h-4"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No quizzes found. Add one!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}