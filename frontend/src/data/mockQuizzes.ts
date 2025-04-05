// src/data/mockQuizzes.ts

// Define interfaces matching our expected data structure (based on schema)
export interface Question {
    QuestionID: number;
    Text: string;
    Options: string[]; // Assuming multiple choice, store options as an array
    CorrectAnswerIndex: number; // Index of the correct option in the options array
  }
  
  export interface Quiz {
    QuizID: number;
    Title: string;
    Subject: string; // Added subject for better display/filtering
    DifficultyLevel: 'Easy' | 'Medium' | 'Hard';
    TimeLimit: number; // in minutes
  }
  
  // Mock Data Array
  export const mockQuizzes: Quiz[] = [
    // {
    //   quizId: 1,
    //   title: "Introduction to React Hooks",
    //   subject: "Web Development",
    //   difficultyLevel: "Easy",
    //   timeLimit: 10,
    //   questions: [
    //     { questionId: 101, text: "What is useState?", options: ["A function component", "A built-in React Hook", "A CSS property", "A lifecycle method"], correctAnswerIndex: 1 },
    //     { questionId: 102, text: "What does useEffect do?", options: ["Manages component state", "Performs side effects", "Renders JSX", "Handles events"], correctAnswerIndex: 1 },
    //     { questionId: 103, text: "Can you use Hooks in class components?", options: ["Yes", "No", "Only useState", "Only useEffect"], correctAnswerIndex: 1 },
    //   ],
    // },
    // {
    //   quizId: 2,
    //   title: "Advanced CSS Concepts",
    //   subject: "Web Design",
    //   difficultyLevel: "Medium",
    //   timeLimit: 15,
    //   questions: [
    //     { questionId: 201, text: "What is the CSS Box Model?", options: ["A layout technique", "Margin, Border, Padding, Content", "A way to style text", "A JavaScript object"], correctAnswerIndex: 1 },
    //     { questionId: 202, text: "What is Flexbox primarily used for?", options: ["Styling text", "One-dimensional layout", "Making API calls", "Animations"], correctAnswerIndex: 1 },
    //     { questionId: 203, text: "What does 'position: absolute;' do?", options: ["Positions relative to the viewport", "Positions relative to the nearest positioned ancestor", "Removes element from flow", "Both B and C"], correctAnswerIndex: 3 },
    //     { questionId: 204, text: "What unit is relative to the viewport width?", options: ["%", "em", "rem", "vw"], correctAnswerIndex: 3 },
    //   ],
    // },
    // {
    //   quizId: 3,
    //   title: "Node.js Fundamentals",
    //   subject: "Backend Development",
    //   difficultyLevel: "Easy",
    //   timeLimit: 10,
    //   questions: [
    //       { questionId: 301, text: "What is Node.js?", options: ["A frontend framework", "A JavaScript runtime", "A database", "A package manager"], correctAnswerIndex: 1},
    //       { questionId: 302, text: "What is npm?", options: ["Node Project Manager", "Node Package Manager", "Network Protocol Manager", "New Project Maker"], correctAnswerIndex: 1},
    //       { questionId: 303, text: "What module is used for handling file system operations?", options: ["http", "url", "fs", "path"], correctAnswerIndex: 2},
    //   ],
    // },
    // Add more quizzes as needed
  ];
  
  // Helper function to get a single quiz by ID (useful later)
  export const getQuizById = (id: number): Quiz | undefined => {
      return mockQuizzes.find(quiz => quiz.QuizID === id);
  }