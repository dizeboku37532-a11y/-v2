// FIX: Define the Question interface to structure quiz data.
export interface Question {
  question: string;
  options: string[];
  answer: string[];
  explanation: string;
}

// FIX: Define the QuizState type for managing application flow.
export type QuizState = 'upload' | 'generating' | 'in_progress' | 'results';