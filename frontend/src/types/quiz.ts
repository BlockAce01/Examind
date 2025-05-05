

// matches the structure of question data received from the backend.
export interface Question {
    QuestionID: number;  // unique identifier for the question
    QuizID?: number;  // array of answer options
    Text: string; //The actual question text
    Options: string[];
    CorrectAnswerIndex: number;
}

// fetched from the quiz list API endpoint.
export interface QuizListItem {
    QuizID: number;
    Title: string;
    Subject: string;
    DifficultyLevel: 'Easy' | 'Medium' | 'Hard';
    TimeLimit: number;
    questionCount?: number; 
}

// full details of a quiz including its list of questions.
export interface QuizDetail extends QuizListItem {
        questions: Question[];   // array of questions belonging to this quiz
}