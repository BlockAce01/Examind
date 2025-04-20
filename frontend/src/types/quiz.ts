// src/types/quiz.ts

// Ensure this Question type matches data from GET /quizzes/:id and the question CRUD endpoints
export interface Question {
    QuestionID: number;
    QuizID?: number; // Might be returned by backend, useful sometimes
    Text: string;
    Options: string[];
    CorrectAnswerIndex: number;
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