'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import QuizResultChatbot from '@/components/quiz/QuizResultChatbot';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

// define type for individual question data from API
interface Question {
    QuestionID: number;
    Text: string;
    Options: string[];
    CorrectAnswerIndex: number;
    SubmittedAnswerIndex: number | null;
}

//define type for result data fetched from API
interface QuizResultData {
    quizTitle: string;
    score: number;
    totalQuestions: number;
    submissionTime: string;
    questions: Question[];
    quizId: number;
}

export default function QuizResultsPageWrapper() {
    return (
        <ProtectedRoute>
            <QuizResultsPageContent />
        </ProtectedRoute>
    );
}

function QuizResultsPageContent() {
    const params = useParams();
    const router = useRouter();
    const { token, isAuthenticated } = useAuth();
    const quizId = params.quizId as string;
    const quizIdNum = parseInt(quizId, 10);

    const [result, setResult] = useState<QuizResultData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

    useEffect(() => {
        //validate quizId and authentication
        if (!quizIdNum || isNaN(quizIdNum) || !isAuthenticated || !token) {
            if (!isAuthenticated) {
                 setError("Please log in to view results.");
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
                //use the new endpoint to fetch the result for the logged-in user
                const response = await fetch(`${apiUrl}/api/v1/quizzes/${quizIdNum}/result`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({})); // Try to get error msg
                    //handle 404 errors
                    if (response.status === 404) {
                        throw new Error(errorData.message || 'Quiz result not found. Have you completed this quiz?');
                    }
                    throw new Error(errorData.message || `Failed to fetch results. Status: ${response.status}`);
                }

                const data = await response.json();
                if (data.status === 'success' && data.data) {
                    // Add quizId to the result data before setting state
                    setResult({ ...data.data, quizId: quizIdNum }); // Set the fetched result data
                } else {
                    throw new Error(data.message || 'Invalid result data format received from API.');
                }
            } catch (err: any) {
                console.error("Fetch Result Error:", err);
                // Check if the error is due to the user not being logged in or result not found
                if (err.message.includes('log in') || err.message.includes('Quiz result not found')) {
                     setError(err.message);
                } else {
                    setError(err.message || 'Could not load quiz results.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchResult();
        //only run when these dependencies change
    }, [quizIdNum, token, isAuthenticated, router]);


    //render logic

    if (isLoading) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }

    //errors during fetch
    if (error) {
         return (
             <div className="text-center p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                 <p><strong>Error:</strong> {error}</p>
                 <Link href={error.includes('log in') ? '/login' : '/quizzes'} className="block mt-4">
                     <Button variant="secondary">
                         {error.includes('log in') ? 'Go to Login' : 'Back to Quizzes'}
                     </Button>
                 </Link>
             </div>
         );
    }

    // Handle question selection
    const handleQuestionSelect = (question: Question, isSelected: boolean) => {
        setSelectedQuestions(prevSelected => {
            if (isSelected) {
                // Add question if not already selected
                if (!prevSelected.find(q => q.QuestionID === question.QuestionID)) {
                    return [...prevSelected, question];
                }
            } else {
                // Remove question if deselected
                return prevSelected.filter(q => q.QuestionID !== question.QuestionID);
            }
            return prevSelected; // Return current state if no change
        });
    };

    //render the results
    if (result) {
        const percentage = result.totalQuestions > 0 ? Math.round((result.score / result.totalQuestions) * 100) : 0;

        return (
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Quiz Results: {result.quizTitle}</h1>
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

                {/* Detailed Answers Review */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-2">Answer Review</h2>
                    {result.questions && result.questions.length > 0 ? (
                        <ul className="space-y-6">
                            {result.questions.map((question, index) => (
                                <li key={question.QuestionID} className="bg-white p-5 rounded-lg shadow border border-gray-200">
                                    <div className="flex items-start mb-3">
                                        {/* Checkbox for selection */}
                                        <input
                                            type="checkbox"
                                            id={`select-q-${question.QuestionID}`}
                                            checked={selectedQuestions.some(q => q.QuestionID === question.QuestionID)}
                                            onChange={(e) => handleQuestionSelect(question, e.target.checked)}
                                            className="mr-3 mt-1 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label htmlFor={`select-q-${question.QuestionID}`} className="font-medium text-lg text-gray-800 flex-1 cursor-pointer">
                                            Question {index + 1}: {question.Text}
                                        </label>
                                    </div>
                                    <ul className="space-y-2">
                                        {question.Options.map((option, optionIndex) => {
                                            const isCorrect = optionIndex === question.CorrectAnswerIndex;
                                            const isSubmitted = optionIndex === question.SubmittedAnswerIndex;
                                            const isIncorrectSubmitted = isSubmitted && !isCorrect;

                                            return (
                                                <li
                                                    key={optionIndex}
                                                    className={`
                                                        p-3 rounded border
                                                        ${isCorrect
                                                            ? 'bg-green-100 border-green-300 text-green-800 font-semibold' // Correct answer
                                                            : isIncorrectSubmitted
                                                                ? 'bg-red-100 border-red-300 text-red-800 font-semibold' // Incorrect submitted answer
                                                                : 'bg-gray-50 border-gray-200 text-gray-700' // Unselected or correct submitted
                                                        }
                                                    `}
                                                >
                                                    {option}
                                                    {isCorrect && <CheckIcon className="inline-block w-5 h-5 ml-2 text-green-600" />}
                                                    {isIncorrectSubmitted && <XMarkIcon className="inline-block w-5 h-5 ml-2 text-red-600" />}
                                                    {isSubmitted && !isIncorrectSubmitted && !isCorrect && (
                                                         // This case is for when the user submitted an answer, but it wasn't the correct one,
                                                         // and it's not the incorrect submitted case (which is handled above).
                                                         // This might happen if the user submitted the correct answer, which is already handled by the isCorrect check.
                                                         // Adding this for completeness, though it might not render in typical scenarios.
                                                         <span className="ml-2 text-gray-600">(Your Answer)</span>
                                                    )}
                                                     {isSubmitted && isCorrect && (
                                                         <span className="ml-2 text-green-600">(Your Answer)</span>
                                                     )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No questions available for review.</p>
                    )}
                </div>

                 {/*AI assistant section*/}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">AI Assistant</h2>
                    <QuizResultChatbot selectedQuestions={selectedQuestions} quizTitle={result.quizTitle} quizId={result.quizId} />
                </div>

                {/*Nav Buttons*/}
                <div className="mt-10 text-center">
                    <Link href="/quizzes"> <Button variant="secondary" className="mr-4">Back to Quizzes</Button> </Link>
                    <Link href="/dashboard"> <Button variant="primary">Go to Dashboard</Button> </Link>
                </div>
            </div>
        );
    }

    //fallback if result is somehow null after loading without error(should ideally not be reached)
    return <div className="text-center p-10">Could not display results.</div>;
}
