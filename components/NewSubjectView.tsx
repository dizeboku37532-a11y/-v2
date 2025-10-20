import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface NewSubjectViewProps {
  onTextSubmit: (text: string) => void;
  loading: boolean;
  onBack: () => void;
}

const NewSubjectView: React.FC<NewSubjectViewProps> = ({ onTextSubmit, loading, onBack }) => {
  const { t } = useLanguage();
  const [pastedText, setPastedText] = useState('');

  const handleTextGenerate = () => {
    if (pastedText.trim().length < 50) {
      alert(t('errorTooShort'));
      return;
    }
    onTextSubmit(pastedText);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-slate-200">{t('createSubject')}</h1>
       <p className="text-slate-400 mb-6 text-center">{t('appSubtitle')}</p>
      
      <textarea
        value={pastedText}
        onChange={(e) => setPastedText(e.target.value)}
        placeholder={t('pastePlaceholder')}
        disabled={loading}
        className="w-full h-48 p-4 bg-slate-800 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-slate-200 placeholder-slate-500"
      ></textarea>
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
         <button 
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-3 px-6 text-lg font-semibold rounded-lg bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all"
        >
          {t('backToSubjects')}
        </button>
        <button 
          onClick={handleTextGenerate}
          disabled={loading || pastedText.trim().length === 0}
          className="flex-1 py-3 px-6 text-lg font-semibold rounded-lg bg-teal-500 hover:bg-teal-600 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all"
        >
          {t('generateQuiz')}
        </button>
      </div>
    </div>
  );
};

export default NewSubjectView;