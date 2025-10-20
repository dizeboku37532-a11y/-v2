// FIX: Define the Question interface to structure quiz data.
export interface Question {
  question: string;
  options: string[];
  answer: string[];
  explanation: string;
}

// FIX: Define the QuizAttempt interface to store results from each quiz session.
export interface QuizAttempt {
  date: number; // Stored as a UTC timestamp
  score: number;
  totalQuestions: number;
}

// FIX: Add a history property to the Subject interface to track learning progress.
export interface Subject {
  id: string;
  name: string;
  content: string;
  history?: QuizAttempt[];
  questions?: Question[];
}

// FIX: Define the QuizState type for managing application flow.
export type QuizState = 'subject_selection' | 'upload' | 'generating' | 'in_progress' | 'results';

// FIX: Add Language type for internationalization.
export type Language = 'en' | 'zh';