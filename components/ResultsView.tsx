import React from 'react';
import { ReplayIcon, BrainIcon, TrophyIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface ResultsViewProps {
  score: number;
  totalQuestions: number;
  hasWrongAnswers: boolean;
  onRestart: () => void;
  onReview: () => void;
  hasNextBatch: boolean;
  onNextBatch: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ score, totalQuestions, hasWrongAnswers, onRestart, onReview, hasNextBatch, onNextBatch }) => {
  const { t } = useLanguage();
  const percentage = Math.round((score / totalQuestions) * 100);

  const getFeedback = () => {
    if (percentage === 100) return { message: t('perfectScore'), icon: <TrophyIcon className="h-24 w-24 text-yellow-400"/>, color: "text-yellow-400" };
    if (percentage >= 80) return { message: t('excellentWork'), icon: <TrophyIcon className="h-24 w-24 text-green-400"/>, color: "text-green-400" };
    if (percentage >= 50) return { message: t('goodEffort'), icon: <BrainIcon className="h-24 w-24 text-cyan-400"/>, color: "text-cyan-400" };
    return { message: t('keepPracticing'), icon: <BrainIcon className="h-24 w-24 text-slate-400"/>, color: "text-slate-400" };
  };

  const feedback = getFeedback();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800 rounded-xl shadow-2xl max-w-2xl mx-auto">
      <div className="mb-6">
        {feedback.icon}
      </div>
      <h2 className={`text-4xl font-bold mb-2 ${feedback.color}`}>{feedback.message}</h2>
      <p className="text-slate-300 text-xl mb-4">{t('youAnswered')}</p>
      <p className="text-6xl font-bold text-white mb-6">
        {score} / {totalQuestions}
      </p>
      <div className="text-2xl font-semibold text-cyan-400 mb-8">
        ({percentage}%)
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        {hasNextBatch && (
          <button
            onClick={onNextBatch}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 text-lg font-semibold rounded-lg bg-teal-500 hover:bg-teal-600 transition-colors transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            <span>{t('nextBatch')}</span>
          </button>
        )}
        {hasWrongAnswers && (
          <button
            onClick={onReview}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 text-lg font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 transition-colors transform hover:scale-105"
          >
            <BrainIcon className="w-6 h-6" />
            <span>{t('reviewMistakes')}</span>
          </button>
        )}
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 text-lg font-semibold rounded-lg bg-slate-600 hover:bg-slate-500 transition-colors transform hover:scale-105"
        >
          <ReplayIcon className="w-6 h-6" />
          <span>{t('restartQuiz')}</span>
        </button>
      </div>
    </div>
  );
};

export default ResultsView;
