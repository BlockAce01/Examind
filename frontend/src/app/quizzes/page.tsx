'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QuizCard from '@/components/quiz/QuizCard';
import { type QuizListItem } from '@/types/quiz';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
//import { getMockLoggedInUser, type User as MockUserType } from '@/data/mockUsers';

//helper function
const getUniqueValues = (items: QuizListItem[], key: keyof QuizListItem) => {
    const values = items.map(item => item[key]).filter(Boolean);
    return Array.from(new Set(values as string[]));
}

//Simulate roles
//const SIMULATED_ROLE: 'student' | 'teacher' | 'admin' = 'student';


export default function QuizzesPage() {
    const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');

    //get auth context
    const { user, token } = useAuth();
    //const currentUser: MockUserType | undefined = getMockLoggedInUser(SIMULATED_ROLE);
    const isAdminOrTeacher = user?.Role === 'teacher' || user?.Role === 'admin';

    //data fetching
    useEffect(() => {
        const fetchQuizzes = async () => {
            setIsLoading(true);
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                const response = await fetch(`${apiUrl}/api/v1/quizzes`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, //Add Authorization
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
                const data = await response.json();

                //check quiz structure
                if (data.status === 'success' && Array.isArray(data.data?.quizzes)) {
                    setQuizzes(data.data.quizzes)
                } else {
                    throw new Error(data.message || 'Invalid API response format');
                }
            } catch (err: any) {
                console.error("Failed to fetch quizzes:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizzes();
    }, [token]); //add token to dependency array

    const [studentSubjects, setStudentSubjects] = useState<{ SubjectID: number; Name: string }[]>([]);

    useEffect(() => {
        const fetchStudentSubjects = async () => {
            if (user?.Role === 'student' && token) {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                    const response = await fetch(`${apiUrl}/api/v1/subjects/student`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setStudentSubjects(data);
                    }
                } catch (error) {
                    console.error('Failed to fetch student subjects:', error);
                }
            }
        };
        fetchStudentSubjects();
    }, [user, token]);

    //ensure keys match the QuizListItem type casing
    const uniqueSubjects = user?.Role === 'student' ? studentSubjects.map(s => s.Name) : getUniqueValues(quizzes, 'Subject');
    const difficulties = ['Easy', 'Medium', 'Hard'];

    //client-side filter logic
    const filteredQuizzes = quizzes.filter(quiz => {
        const matchesSubject = selectedSubject === '' || quiz.Subject === selectedSubject;
        const matchesDifficulty = selectedDifficulty === '' || quiz.DifficultyLevel === selectedDifficulty;
        const studentHasSubject = user?.Role !== 'student' || uniqueSubjects.includes(quiz.Subject);
        return matchesSubject && matchesDifficulty && studentHasSubject;
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

            {/*filter UI*/}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row gap-4">
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="p-2 border rounded bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none flex-grow sm:flex-grow-0"
                    aria-label="Filter by subject"
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
                    aria-label="Filter by difficulty"
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

            {/*content area*/}
            {isLoading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                    <Spinner size="lg" />
                </div>
            ) : filteredQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuizzes.map((quiz) => (
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
