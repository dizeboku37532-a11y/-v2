import React from 'react';
import type { QuizAttempt } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ProgressChartProps {
  attempts: QuizAttempt[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ attempts }) => {
  const { t, language } = useLanguage();

  if (!attempts || attempts.length === 0) {
    return <p className="text-slate-400 text-center py-8">{t('noHistory')}</p>;
  }

  if (attempts.length < 2) {
    return <p className="text-slate-400 text-center py-8">{t('notEnoughHistory')}</p>;
  }

  const sortedAttempts = [...attempts].sort((a, b) => a.date - b.date);

  const width = 500;
  const height = 250;
  const padding = 50;

  const minDate = sortedAttempts[0].date;
  const maxDate = sortedAttempts[sortedAttempts.length - 1].date;

  const getX = (date: number) => {
    if (maxDate === minDate) return padding;
    return padding + ((date - minDate) / (maxDate - minDate)) * (width - padding * 2);
  };

  const getY = (score: number, total: number) => {
    const percentage = total > 0 ? score / total : 0;
    return height - padding - percentage * (height - padding * 2);
  };

  const pathData = sortedAttempts
    .map((attempt, i) => {
      const x = getX(attempt.date);
      const y = getY(attempt.score, attempt.totalQuestions);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(language, { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="font-sans">
        {/* Y-Axis Labels and Grid Lines */}
        {[0, 25, 50, 75, 100].map(p => (
          <g key={p}>
            <line 
              x1={padding} y1={getY(p, 100)} 
              x2={width - padding} y2={getY(p, 100)} 
              stroke="#475569" strokeWidth="0.5"
            />
            <text 
              x={padding - 10} y={getY(p, 100) + 5} 
              textAnchor="end" fill="#94a3b8" fontSize="12"
            >
              {p}%
            </text>
          </g>
        ))}

        {/* X-Axis Labels */}
        {sortedAttempts.map((attempt, i) => (
             <text 
                key={i} x={getX(attempt.date)} y={height - padding + 20}
                textAnchor="middle" fill="#94a3b8" fontSize="12"
             >
                {formatDate(attempt.date)}
             </text>
        ))}

        {/* Line */}
        <path d={pathData} fill="none" stroke="#22d3ee" strokeWidth="2" />

        {/* Points and Tooltips */}
        {sortedAttempts.map((attempt, i) => (
          <g key={i}>
            <circle cx={getX(attempt.date)} cy={getY(attempt.score, attempt.totalQuestions)} r="4" fill="#22d3ee" className="cursor-pointer">
              <title>{`${t('score')}: ${attempt.score}/${attempt.totalQuestions} (${Math.round(attempt.score/attempt.totalQuestions * 100)}%) - ${t('date')}: ${new Date(attempt.date).toLocaleDateString()}`}</title>
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default ProgressChart;