import React, { useState, useEffect } from 'react';
import type { Question } from '../types';
import { CheckIcon, CrossIcon } from './icons';

interface QuizViewProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSubmit: (isCorrect: boolean) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ question, questionNumber, totalQuestions, onAnswerSubmit }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  const isCorrect = isAnswered && 
    question.answer.length === selectedOptions.length &&
    question.answer.every(ans => selectedOptions.includes(ans));

  // Reset state when a new question is displayed
  useEffect(() => {
    setSelectedOptions([]);
    setIsAnswered(false);
  }, [question]);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option) 
        : [...prev, option]
    );
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) return;
    setIsAnswered(true);
    const correct = question.answer.length === selectedOptions.length && question.answer.every(ans => selectedOptions.includes(ans));
    
    // If correct, automatically move to the next question after a delay
    if (correct) {
      setTimeout(() => {
        onAnswerSubmit(true);
      }, 2500);
    }
    // If incorrect, the user will have to click "Next Question" manually
  };

  const handleNextQuestion = () => {
    onAnswerSubmit(false); // We know it's incorrect if this button is visible
  }

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return selectedOptions.includes(option)
        ? 'bg-cyan-600 ring-2 ring-cyan-400'
        : 'bg-slate-700 hover:bg-slate-600';
    }
    // After answering, highlight correct and incorrect choices
    if (question.answer.includes(option)) {
      return 'bg-green-600 ring-2 ring-green-400';
    }
    if (selectedOptions.includes(option) && !question.answer.includes(option)) {
      return 'bg-red-600 ring-2 ring-red-400';
    }
    return 'bg-slate-700 opacity-50';
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-8 bg-slate-800 rounded-xl shadow-2xl">
      <div className="mb-6 text-center">
        <p className="text-lg text-cyan-400 font-semibold">Question {questionNumber} / {totalQuestions}</p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mt-2">{question.question}</h2>
        {question.answer.length > 1 && !isAnswered && (
            <p className="text-sm text-slate-400 mt-2">(Multiple answers may be correct)</p>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {(question.options || []).map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-lg transition-all text-slate-100 font-medium text-lg ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {!isAnswered ? (
         <button
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0}
            className="w-full py-3 px-6 text-lg font-semibold rounded-lg bg-teal-500 hover:bg-teal-600 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
        >
            Submit Answer
        </button>
      ) : (
        <div className={`p-4 rounded-lg text-center ${isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
            <div className="flex items-center justify-center gap-2 mb-2">
                {isCorrect ? <CheckIcon className="w-8 h-8 text-green-400" /> : <CrossIcon className="w-8 h-8 text-red-400" />}
                <h3 className={`text-2xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                </h3>
            </div>
            <p className="text-slate-200">{question.explanation}</p>
            {!isCorrect && (
                 <button
                    onClick={handleNextQuestion}
                    className="mt-4 w-full py-3 px-6 text-lg font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 transition-colors"
                >
                    Next Question
                </button>
            )}
        </div>
      )}
    </div>
  );
};

export default QuizView;