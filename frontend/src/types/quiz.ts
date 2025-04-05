// src/types/quiz.ts
export interface Question {
    QuestionID: number;
    Text: string;
    Options: string[];
    CorrectAnswerIndex: number;
    // Add QuizID if needed directly on question for some reason
}

// Type for Quiz data fetched from API list endpoint
export interface QuizListItem {
    QuizID: number;
    Title: string;
    Subject: string;
    DifficultyLevel: 'Easy' | 'Medium' | 'Hard';
    TimeLimit: number;
    questionCount?: number; // From COUNT() in API
}

// Type for detailed Quiz data fetched from single quiz endpoint
export interface QuizDetail extends QuizListItem {
    questions: Question[]; // Includes the actual questions
}