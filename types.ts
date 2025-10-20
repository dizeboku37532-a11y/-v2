// FIX: Define the Question interface to structure quiz data.
export interface Question {
  question: string;
  options: string[];
  answer: string[];
  explanation: string;
}

// FIX: Add Subject interface for storing quiz topics.
export interface Subject {
  id: string;
  name: string;
  content: string;
}

// FIX: Define the QuizState type for managing application flow.
export type QuizState = 'subject_selection' | 'upload' | 'generating' | 'in_progress' | 'results';

// FIX: Add Language type for internationalization.
export type Language = 'en' | 'zh';