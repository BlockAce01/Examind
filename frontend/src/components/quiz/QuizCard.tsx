import React from 'react';
import Link from 'next/link';
import { ClockIcon, PuzzlePieceIcon, TagIcon } from '@heroicons/react/24/outline';
import { type QuizListItem } from '@/types/quiz';

interface QuizCardProps {
  quiz: QuizListItem;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  //function to determine difficulty color
  const getDifficultyClass = (level: QuizListItem['DifficultyLevel']) => {
    switch (level) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{quiz.Title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyClass(quiz.DifficultyLevel)}`}>
                {quiz.DifficultyLevel}
            </span>
        </div>
        <p className="text-sm text-gray-600 mb-4 flex items-center">
            <TagIcon className="w-4 h-4 mr-1.5 text-gray-500"/>
            {quiz.Subject}
        </p>

        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
          <span className="flex items-center">
            <PuzzlePieceIcon className="w-4 h-4 mr-1.5" />
            {quiz.questionCount ?? 'N/A'} Questions
          </span>
          <span className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1.5" /> {quiz.TimeLimit} min
          </span>
        </div>
      </div>

      <Link
        href={`/quizzes/${quiz.QuizID}/take`}
        className="mt-4 inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-150 ease-in-out font-medium"
      >
        Start Quiz
      </Link>
    </div>
  );
};

export default QuizCard;