// src/app/quizzes/[quizId]/take/page.tsx
'use client'; // IMPORTANT: Mark this as a Client Component

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Hooks for client components
import { getQuizById, type Quiz, type Question } from '@/data/mockQuizzes'; // Get our mock data functions/types
import Button from '@/components/ui/Button'; // Reusable button
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Spinner from '@/components/ui/Spinner'; // Import Spinner

export default function QuizTakePage() {
  // --- Hooks ---
  const params = useParams(); // Gets route parameters (e.g., { quizId: '1' })
  const router = useRouter(); // Allows programmatic navigation (e.g., to results page)
  const quizId = parseInt(params.quizId as string); // Get quizId from URL and convert to number

  // --- State ---
  const [quiz, setQuiz] = useState<Quiz | null>(null); // Store the loaded quiz data
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]); // Store user's answers (index of selected option)
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // --- Effects ---
  // Load quiz data when the component mounts or quizId changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const fetchedQuiz = getQuizById(quizId); // Fetch the quiz data

    if (fetchedQuiz) {
      setQuiz(fetchedQuiz);
      // Initialize selectedAnswers array with nulls, matching the number of questions
      setSelectedAnswers(Array(fetchedQuiz.questions.length).fill(null));
      setIsLoading(false);
    } else {
      setError("Quiz not found.");
      setIsLoading(false);
    }
  }, [quizId]); // Dependency array ensures this runs when quizId changes

  // --- Event Handlers ---
  const handleAnswerSelect = (optionIndex: number) => {
      // Create a copy of the state array
      const newAnswers = [...selectedAnswers];
      // Update the answer for the current question index
      newAnswers[currentQuestionIndex] = optionIndex;
      // Set the updated state
      setSelectedAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
      // In a real app, you'd calculate score and save results here
      console.log("Quiz Finished! Answers:", selectedAnswers);
      // Navigate to results page (we'll create this later)
      router.push(`/quizzes/${quizId}/results?answers=${JSON.stringify(selectedAnswers)}`); // Pass answers via query param for now
  };


  // --- Render Logic ---
  if (isLoading) {
    return <div className="text-center p-10">Loading Quiz...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">{error}</div>;
  }

  if (!quiz) {
    // Should be caught by error state, but good to have a fallback
    return <div className="text-center p-10">Could not load quiz data.</div>;
  }

  const currentQuestion: Question = quiz.questions[currentQuestionIndex];
  const currentSelectedAnswer = selectedAnswers[currentQuestionIndex];


  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">{quiz.Title}</h1>
      <p className="text-gray-600 mb-6">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
      {/* We can add a timer component here later */}

      {/* Question Display Area */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <p className="text-lg font-medium text-gray-900 mb-5">{currentQuestion.Text}</p>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-3 rounded border transition-colors duration-150 flex items-center justify-between
                                  ${currentSelectedAnswer === index
                                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' // Selected style
                                      : 'border-gray-300 bg-white hover:bg-gray-50' // Default style
                                  }`}
            >
              <span>{option}</span>
              {currentSelectedAnswer === index && <CheckCircleIcon className="w-5 h-5 text-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0} // Disable if it's the first question
          variant="secondary"
          className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
           <ArrowLeftIcon className="w-4 h-4 mr-2"/> Previous
        </Button>

         {/* Show Finish button only on the last question */}
         {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button
                onClick={finishQuiz}
                variant="primary"
                className="bg-green-600 hover:bg-green-700 flex items-center" // Custom success color
              >
                 Finish Quiz <CheckCircleIcon className="w-4 h-4 ml-2"/>
              </Button>
         ) : (
             <Button
               onClick={goToNextQuestion}
               disabled={currentQuestionIndex === quiz.questions.length - 1} // Disable if it's the last question
               variant="primary"
               className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
             >
               Next <ArrowRightIcon className="w-4 h-4 ml-2"/>
             </Button>
         )}
      </div>
    </div>
  );
}