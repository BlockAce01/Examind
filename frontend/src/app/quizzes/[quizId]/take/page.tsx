'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { type QuizDetail, type Question } from '@/types/quiz';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function QuizTakePageWrapper() {
    return (
        <ProtectedRoute>
            <QuizTakePageContent />
        </ProtectedRoute>
    );
}

function QuizTakePageContent() {
    const params = useParams();
    const router = useRouter();
    const { token, isAuthenticated } = useAuth();
    const quizId = params.quizId as string;
    const quizIdNum = parseInt(quizId, 10);

    //state
    const [quiz, setQuiz] = useState<QuizDetail | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //effects
    useEffect(() => {
        if (!quizIdNum || isNaN(quizIdNum)) {
            setError("Invalid Quiz ID.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        //check for token before fetching
        if (!token) {
            setError("Not authorized, please log in.");
            setIsLoading(false);
            return;
        }

        const fetchQuizDetails = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/quizzes/${quizIdNum}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, //add authorization
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
                    //handle 401/403 errors
                    if (response.status === 401 || response.status === 403) {
                         setError(errorData.message || "Unauthorized: You may need to log in again.");
                    } else {
                        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                    }
                    return;
                }
                const data = await response.json();
                if (data.status === 'success' && data.data?.quiz) {
                    setQuiz(data.data.quiz);
                    setSelectedAnswers(Array(data.data.quiz.questions?.length || 0).fill(null));
                } else {
                    throw new Error(data.message || 'Invalid quiz data format.');
                }
            } catch (err: any) {
                setError(err.message || 'Could not load quiz.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuizDetails();
    }, [quizIdNum, token]); //add token to dependency array

    //event handlers
    const handleAnswerSelect = (optionIndex: number) => {
         if (!quiz || !quiz.questions || currentQuestionIndex >= quiz.questions.length) return;
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setSelectedAnswers(newAnswers);
    };

    const goToNextQuestion = () => {
        if (quiz && quiz.questions && currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    //finish quiz
    const finishQuiz = async () => {
        if (!isAuthenticated || !token) { setError("You must be logged in to submit the quiz."); return; }
        setIsSubmitting(true);
        setError(null);
        console.log("Submitting answers:", selectedAnswers);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/quizzes/${quizIdNum}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify({ answers: selectedAnswers }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `HTTP error! status: ${response.status}`);
            console.log("Submission successful, API response:", data);
            router.push(`/quizzes/${quizIdNum}/results`);
        } catch (err: any) {
            console.error("Quiz submission failed:", err);
            setError(err.message || 'An error occurred during submission.');
            setIsSubmitting(false);
        }
    };

    //render logic
    if (isLoading) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }

    if (error && !quiz) { //show error if quiz couldn't load
        return <div className="text-center p-10 text-red-600">{error}</div>;
    }

    if (!quiz) {
        return <div className="text-center p-10">Could not load quiz data.</div>;
    }

    const questionsExist = Array.isArray(quiz.questions) && quiz.questions.length > 0;
    const currentQuestion: Question | undefined = questionsExist ? quiz.questions[currentQuestionIndex] : undefined;

    //handle case where quiz exists but has no questions or index is bad
    if (!currentQuestion) {
       return (
             <div className="text-center p-10 text-orange-600">
                 <p>{questionsExist ? "Error loading current question." : "This quiz currently has no questions."}</p>
                 <Link href="/quizzes" className='mt-4 inline-block'><Button variant='secondary'>Back to Quizzes</Button></Link>
             </div>
         );
    }
    const currentSelectedAnswer = selectedAnswers[currentQuestionIndex];

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            {error && !isLoading && isSubmitting && ( //show only submit errors
                 <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                     {error}
                 </div>
            )}

            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">{quiz.Title}</h1>
            <p className="text-gray-600 mb-6">Question {currentQuestionIndex + 1} of {quiz.questions?.length || 0}</p>

            {/*question display*/}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
                <p className="text-lg font-medium text-gray-900 mb-5">{currentQuestion.Text}</p>
                <div className="space-y-3">
                    {currentQuestion.Options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={isSubmitting}
                            className={`w-full text-left p-3 rounded border transition-colors duration-150 flex items-center justify-between disabled:opacity-70 disabled:cursor-not-allowed ${currentSelectedAnswer === index ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                        >
                            <span>{option}</span>
                            {currentSelectedAnswer === index && <CheckCircleIcon className="w-5 h-5 text-blue-600" />}
                        </button>
                    ))}
                </div>
            </div>

            {/*navigation buttons*/}
            <div className="flex justify-between items-center">
                <Button
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0 || isSubmitting}
                    variant="secondary" className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                > <ArrowLeftIcon className="w-4 h-4 mr-2"/> Previous </Button>

                {currentQuestionIndex === (quiz.questions?.length || 0) - 1 ? (
                    <Button
                        onClick={finishQuiz}
                        variant="primary"
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isSubmitting ? <Spinner size="sm" /> : <>Finish Quiz <CheckCircleIcon className="w-4 h-4 ml-2"/></>}
                    </Button>
                ) : (
                    <Button
                        onClick={goToNextQuestion}
                        disabled={currentQuestionIndex === (quiz.questions?.length || 0) - 1 || isSubmitting}
                        variant="primary" className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    > Next <ArrowRightIcon className="w-4 h-4 ml-2"/> </Button>
                )}
            </div>
        </div>
    );
}
