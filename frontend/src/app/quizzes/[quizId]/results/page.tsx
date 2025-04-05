// src/app/quizzes/[quizId]/results/page.tsx
'use client'; // Needs client hooks for params and searchParams

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { getQuizById, type Quiz } from '@/data/mockQuizzes';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'; // Using solid icons for emphasis
import Spinner from '@/components/ui/Spinner'; // Import Spinner


export default function QuizResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams(); // Hook to read query parameters
  const router = useRouter();
  const quizId = parseInt(params.quizId as string);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchedQuiz = getQuizById(quizId);
    const answersParam = searchParams.get('answers'); // Get answers from URL query

    if (fetchedQuiz && answersParam) {
      setQuiz(fetchedQuiz);
      try {
          const parsedAnswers = JSON.parse(answersParam);
          if(Array.isArray(parsedAnswers)) {
              setUserAnswers(parsedAnswers);
              // Calculate score
              let correctCount = 0;
              parsedAnswers.forEach((answerIndex, questionIndex) => {
                  if (answerIndex !== null && fetchedQuiz.questions[questionIndex]?.correctAnswerIndex === answerIndex) {
                      correctCount++;
                  }
              });
              setScore(correctCount);
          } else {
              console.error("Parsed answers is not an array:", parsedAnswers);
              // Handle error state appropriately
          }

      } catch (error) {
        console.error("Failed to parse answers:", error);
        // Handle error state (e.g., show an error message)
      }
    } else {
        // Handle quiz not found or missing answers param
        console.error("Quiz not found or answers missing");
    }
    setIsLoading(false);
  }, [quizId, searchParams]); // Re-run if quizId or searchParams change

  if (isLoading) {
    return <div className="text-center p-10">Calculating Results...</div>;
  }

  if (!quiz || userAnswers.length === 0) {
    return (
        <div className="text-center p-10 text-red-600">
            Could not load quiz results. Please try taking the quiz again.
             <Link href="/quizzes">
                <Button variant="primary" className="mt-4">Back to Quizzes</Button>
             </Link>
        </div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Quiz Results: {quiz.title}</h1>

      {/* Score Summary */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200 mb-8 text-center">
        <p className="text-xl font-medium text-blue-800">Your Score</p>
        <p className="text-5xl font-bold text-blue-600 my-2">{score} / {totalQuestions}</p>
        <p className="text-2xl font-semibold text-blue-700">({percentage}%)</p>
         {/* Basic feedback */}
        <p className="mt-3 text-lg">
            {percentage >= 80 ? "Excellent Work! 🎉" : percentage >= 50 ? "Good Job! 👍" : "Keep Practicing! 💪"}
        </p>
      </div>

      {/* Detailed Answers Review */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Review Your Answers</h2>
      <div className="space-y-4">
        {quiz.questions.map((question, index) => {
          const userAnswerIndex = userAnswers[index];
          const correctAnswerIndex = question.correctAnswerIndex;
          const isCorrect = userAnswerIndex === correctAnswerIndex;

          return (
            <div key={question.questionId} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className="font-medium text-gray-800 mb-2">Question {index + 1}: {question.text}</p>
              <div className="text-sm space-y-1">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`flex items-center p-2 rounded ${
                        optionIndex === correctAnswerIndex ? 'font-semibold text-green-800' : '' // Highlight correct answer text
                    } ${
                        optionIndex === userAnswerIndex && !isCorrect ? 'text-red-800' : '' // Highlight incorrect user answer text
                    } ${
                        optionIndex === userAnswerIndex ? 'bg-opacity-50' : '' // Slight background difference for selected
                    } ${
                       optionIndex === correctAnswerIndex ? 'bg-green-100' : (optionIndex === userAnswerIndex ? 'bg-red-100' : '')
                    }`}
                  >
                    {/* Icon indicating correct/incorrect/user choice */}
                    <span className="w-5 mr-2">
                      {optionIndex === correctAnswerIndex && <CheckIcon className="w-5 h-5 text-green-600 inline-block" />}
                      {optionIndex === userAnswerIndex && !isCorrect && <XMarkIcon className="w-5 h-5 text-red-600 inline-block" />}
                    </span>
                    <span>{option}</span>
                  </div>
                ))}
              </div>
               {/* Show user's choice if they answered */}
               {userAnswerIndex !== null ? (
                   <p className={`mt-2 text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                       Your answer: {question.options[userAnswerIndex]} {isCorrect ? '(Correct)' : '(Incorrect)'}
                   </p>
               ) : (
                   <p className="mt-2 text-sm font-medium text-gray-500">You did not answer this question.</p>
               )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 text-center">
        <Link href="/quizzes">
           <Button variant="secondary" className="mr-4">Back to Quizzes</Button>
        </Link>
        <Link href="/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}