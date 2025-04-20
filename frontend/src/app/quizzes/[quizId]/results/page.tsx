// src/app/quizzes/[quizId]/results/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Removed useSearchParams
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'; // Using solid icons for emphasis
import { useAuth } from '@/context/AuthContext'; // Use auth for fetching

// Define type for result data fetched from API
// Make sure this matches the structure returned by your backend's getQuizResultForUser
interface QuizResultData {
    quizTitle: string;
    score: number;
    totalQuestions: number;
    submissionTime: string;
    // Add userAnswers and detailed questions if your API endpoint provides them for review
    // userAnswers?: (number | null)[];
    // questions?: Question[]; // Import Question type if needed
}

export default function QuizResultsPage() {
    const params = useParams();
    const router = useRouter();
    const { token, isAuthenticated } = useAuth(); // Use auth token and status
    const quizId = params.quizId as string;
    const quizIdNum = parseInt(quizId, 10);

    const [result, setResult] = useState<QuizResultData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Validate quizId and authentication status
        if (!quizIdNum || isNaN(quizIdNum) || !isAuthenticated || !token) {
            if (!isAuthenticated) {
                 setError("Please log in to view results.");
                 // Optionally redirect: router.push('/login');
            }
            else if (isNaN(quizIdNum)){
                 setError("Invalid Quiz ID provided in the URL.");
            }
            setIsLoading(false);
            return;
        }

        const fetchResult = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                // Use the new endpoint to fetch the result for the logged-in user
                const response = await fetch(`${apiUrl}/api/v1/quizzes/${quizIdNum}/result`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Send token to identify user
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({})); // Try to get error msg
                    // Handle specific errors like 404 (result not found)
                    if (response.status === 404) {
                        throw new Error(errorData.message || 'Quiz result not found. Have you completed this quiz?');
                    }
                    throw new Error(errorData.message || `Failed to fetch results. Status: ${response.status}`);
                }

                const data = await response.json();
                if (data.status === 'success' && data.data) {
                    setResult(data.data); // Set the fetched result data
                } else {
                    throw new Error(data.message || 'Invalid result data format received from API.');
                }
            } catch (err: any) {
                console.error("Fetch Result Error:", err);
                setError(err.message || 'Could not load quiz results.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchResult();
        // Only run when these dependencies change
    }, [quizIdNum, token, isAuthenticated, router]); // Added router to dependency array if used for redirect


    // --- Render Logic ---

    if (isLoading) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }

    // Handle errors during fetch
    if (error) {
         return (
             <div className="text-center p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                 <p><strong>Error:</strong> {error}</p>
                 {/* Provide relevant action based on error */}
                 <Link href={error.includes('log in') ? '/login' : '/quizzes'} className="block mt-4">
                     <Button variant="secondary">
                         {error.includes('log in') ? 'Go to Login' : 'Back to Quizzes'}
                     </Button>
                 </Link>
             </div>
         );
    }

    // Handle case where fetch succeeded but no result was found (e.g., user hasn't taken quiz)
    // This is handled within the error block now if API returns 404 with a specific message
    // if (!result) { ... } // This block might not be needed if 404s are caught as errors

    // Render the results if fetch was successful and result exists
    if (result) {
        const percentage = result.totalQuestions > 0 ? Math.round((result.score / result.totalQuestions) * 100) : 0;

        return (
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Quiz Results: {result.quizTitle}</h1>

                {/* Score Summary */}
                <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200 mb-8 text-center">
                    <p className="text-xl font-medium text-blue-800">Your Score</p>
                    <p className="text-5xl font-bold text-blue-600 my-2">{result.score} / {result.totalQuestions}</p>
                    <p className="text-2xl font-semibold text-blue-700">({percentage}%)</p>
                    <p className="mt-3 text-lg">
                        {percentage >= 80 ? "Excellent Work! 🎉" : percentage >= 50 ? "Good Job! 👍" : "Keep Practicing! 💪"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        Submitted on: {new Date(result.submissionTime).toLocaleString()}
                    </p>
                </div>

                {/* Placeholder for Detailed Answers Review */}
                {/* This section requires backend endpoint to return userAnswers and correct answers */}
                <div className="bg-yellow-50 p-4 rounded border border-yellow-200 text-sm text-yellow-800 mb-6">
                    Note: Detailed answer review section requires further implementation on the backend to provide necessary data.
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 text-center">
                    <Link href="/quizzes"> <Button variant="secondary" className="mr-4">Back to Quizzes</Button> </Link>
                    <Link href="/dashboard"> <Button variant="primary">Go to Dashboard</Button> </Link>
                </div>
            </div>
        );
    }

    // Fallback if result is somehow null after loading without error (should ideally not be reached)
    return <div className="text-center p-10">Could not display results.</div>;
}