// src/app/quizzes/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QuizCard from '@/components/quiz/QuizCard';
// Import the shared type
import { type QuizListItem } from '@/types/quiz'; // Adjust path if needed
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
// Use the specific MockUserType or a more general User type if defined elsewhere
import { getMockLoggedInUser, type User as MockUserType } from '@/data/mockUsers';

// Remove local QuizFromAPI interface if defined here

// Helper function (adjust for casing if needed)
const getUniqueValues = (items: QuizListItem[], key: keyof QuizListItem) => {
    const values = items.map(item => item[key]).filter(Boolean);
    return Array.from(new Set(values as string[]));
}

// --- Simulate different roles easily ---
const SIMULATED_ROLE: 'student' | 'teacher' | 'admin' = 'student'; // Changed default for testing view
// --------------------------------------

export default function QuizzesPage() {
    // --- State ---
    const [quizzes, setQuizzes] = useState<QuizListItem[]>([]); // Use shared type
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');

    // Simulate getting logged-in user (replace with useAuth later)
    const currentUser: MockUserType | undefined = getMockLoggedInUser(SIMULATED_ROLE);
    const isAdminOrTeacher = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

    // --- Data Fetching ---
    useEffect(() => {
        const fetchQuizzes = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/quizzes`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Check structure carefully based on console.log(data) if needed
                if (data.status === 'success' && Array.isArray(data.data?.quizzes)) {
                    setQuizzes(data.data.quizzes); // Ensure this data matches QuizListItem[]
                } else {
                    throw new Error(data.message || 'Invalid API response format');
                }
            } catch (err: any) {
                console.error("Failed to fetch quizzes:", err);
                setError(err.message || 'Could not load quizzes.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizzes();
    }, []); // Run once on mount

    // --- Get unique options for filters (from fetched data) ---
    // Ensure keys match the QuizListItem type casing
    const uniqueSubjects = getUniqueValues(quizzes, 'Subject');
    const difficulties = ['Easy', 'Medium', 'Hard'];

    // --- Client-Side Filter Logic ---
    const filteredQuizzes = quizzes.filter(quiz => {
        // Use correct casing from QuizListItem type
        const matchesSubject = selectedSubject === '' || quiz.Subject === selectedSubject;
        const matchesDifficulty = selectedDifficulty === '' || quiz.DifficultyLevel === selectedDifficulty;
        return matchesSubject && matchesDifficulty;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Available Quizzes</h1>
                {isAdminOrTeacher && (
                    <Link href="/admin/quizzes/new">
                        <Button variant='primary' className="bg-green-600 hover:bg-green-700">
                            + Create Quiz
                        </Button>
                    </Link>
                )}
            </div>

            {/* Filter UI */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row gap-4">
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="p-2 border rounded bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none flex-grow sm:flex-grow-0"
                >
                    <option value="">All Subjects</option>
                    {uniqueSubjects.map((subject, index) => (
                        <option key={index} value={subject}>{subject}</option>
                    ))}
                </select>
                <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="p-2 border rounded bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none flex-grow sm:flex-grow-0"
                >
                    <option value="">All Difficulties</option>
                    {difficulties.map((level) => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>
                <Button
                    variant='secondary'
                    onClick={() => { setSelectedSubject(''); setSelectedDifficulty(''); }}
                    disabled={!selectedSubject && !selectedDifficulty}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Clear Filters
                </Button>
            </div>

            {/* Content Area: Loading, Error, List, or Empty State */}
            {isLoading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                    <Spinner size="lg" />
                </div>
            ) : error ? (
                <div className="text-center p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            ) : filteredQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuizzes.map((quiz) => (
                        // Now passing object matching QuizListItem type
                        <QuizCard key={quiz.QuizID} quiz={quiz} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No Quizzes Found"
                    message="No quizzes currently match your selected filters or none are available."
                />
            )}
        </div>
    );
}