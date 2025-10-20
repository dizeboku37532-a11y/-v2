import React, { useState, useCallback } from 'react';
import type { Question, QuizState } from './types';
import { generateQuizFromText } from './services/geminiService';
import InputView from './components/FileUpload';
import Loader from './components/Loader';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const BATCH_SIZE = 20;

function App() {
  const [quizState, setQuizState] = useState<QuizState>('upload');
  const [questions, setQuestions] = useState<Question[]>([]); // Current batch/review questions
  const [allGeneratedQuestions, setAllGeneratedQuestions] = useState<Question[]>([]); // Master list of all questions
  const [remainingQuestions, setRemainingQuestions] = useState<Question[]>([]); // Unseen questions from master list
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [wronglyAnswered, setWronglyAnswered] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startQuiz = useCallback((questionsToStart: Question[]) => {
    setQuestions(shuffleArray(questionsToStart));
    setCurrentQuestionIndex(0);
    setScore(0);
    setWronglyAnswered([]);
    setQuizState('in_progress');
  }, []);

  const startNewBatch = useCallback((questionsToDrawFrom: Question[]) => {
      const nextBatch = questionsToDrawFrom.slice(0, BATCH_SIZE);
      const stillRemaining = questionsToDrawFrom.slice(BATCH_SIZE);
      setRemainingQuestions(stillRemaining);
      startQuiz(nextBatch);
  }, [startQuiz]);
  
  const handleStartOver = () => {
    setQuizState('upload');
    setQuestions([]);
    setAllGeneratedQuestions([]);
    setRemainingQuestions([]);
    setCurrentQuestionIndex(0);
    setWronglyAnswered([]);
    setScore(0);
    setError(null);
    setIsLoading(false);
  };

  const handleTextSubmit = useCallback(async (text: string) => {
    setIsLoading(true);
    setQuizState('generating');
    setError(null);
    try {
      if (!text || text.trim().length < 50) {
         throw new Error("Pasted text is too short.");
      }
      const generatedQuestions = await generateQuizFromText(text);
      if (generatedQuestions.length === 0) {
        throw new Error("Could not generate a quiz from the provided text. The content might not be suitable.");
      }
      setAllGeneratedQuestions(generatedQuestions);
      startNewBatch(generatedQuestions);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Quiz Generation Failed: ${message}`);
      setQuizState('upload');
    } finally {
      setIsLoading(false);
    }
  }, [startQuiz, startNewBatch]);
  
  const handleAnswerSubmit = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setWronglyAnswered(prev => [...prev, questions[currentQuestionIndex]]);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizState('results');
    }
  }, [currentQuestionIndex, questions]);

  const handleRestart = useCallback(() => {
    if (allGeneratedQuestions.length > 0) {
        startNewBatch(allGeneratedQuestions);
    }
  }, [allGeneratedQuestions, startNewBatch]);

  const handleReview = useCallback(() => {
    if (wronglyAnswered.length > 0) {
      startQuiz(wronglyAnswered);
    }
  }, [wronglyAnswered, startQuiz]);

  const handleNextBatch = useCallback(() => {
    if (remainingQuestions.length > 0) {
        startNewBatch(remainingQuestions);
    }
  }, [remainingQuestions, startNewBatch]);

  const renderContent = () => {
    switch (quizState) {
      case 'upload':
        return <InputView onTextSubmit={handleTextSubmit} loading={isLoading} />;
      case 'generating':
        return <Loader message="Building Your Quiz..." />;
      case 'in_progress':
        if (questions.length > 0) {
          return (
            <QuizView
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswerSubmit={handleAnswerSubmit}
            />
          );
        }
        return null;
      case 'results':
        return (
          <ResultsView
            score={score}
            totalQuestions={questions.length}
            hasWrongAnswers={wronglyAnswered.length > 0}
            onRestart={handleRestart}
            onReview={handleReview}
            hasNextBatch={remainingQuestions.length > 0}
            onNextBatch={handleNextBatch}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-gray-900">
        {error && (
            <div className="absolute top-5 left-5 right-5 mx-auto max-w-md bg-red-500 text-white p-3 rounded-lg shadow-lg flex justify-between items-center" role="alert">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="ml-4 font-bold text-xl leading-none">&times;</button>
            </div>
        )}
        {(quizState === 'in_progress' || quizState === 'results') && (
          <button
            onClick={handleStartOver}
            className="absolute top-5 right-5 bg-cyan-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-cyan-500 transition-colors z-10"
          >
            New Quiz
          </button>
        )}
      {renderContent()}
    </main>
  );
}

export default App;