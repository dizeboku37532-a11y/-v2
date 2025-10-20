import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Subject } from '../types';
import { BrainIcon, PlusIcon, TrashIcon } from './icons';

interface SubjectManagerProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onCreateNew: () => void;
}

const SubjectManager: React.FC<SubjectManagerProps> = ({ subjects, onSelectSubject, onDeleteSubject, onCreateNew }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-3xl mx-auto text-center p-4 sm:p-8">
      <BrainIcon className="h-24 w-24 mx-auto text-cyan-400 mb-4"/>
      <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">{t('appTitle')}</h1>
      <p className="text-slate-400 mb-8 text-lg">{t('savedSubjects')}</p>

      <div className="space-y-4 mb-8">
        {subjects.length === 0 ? (
          <p className="text-slate-500 py-8">{t('noSubjects')}</p>
        ) : (
          subjects.map((subject) => (
            <div key={subject.id} className="bg-slate-800 p-4 rounded-lg flex items-center justify-between shadow-md">
              <span className="text-xl font-medium text-slate-100 truncate pr-4">{subject.name}</span>
              <div className="flex-shrink-0 flex gap-2">
                <button
                  onClick={() => onSelectSubject(subject)}
                  className="py-2 px-4 text-sm font-semibold rounded-lg bg-teal-500 hover:bg-teal-600 transition-colors"
                >
                  {t('startQuiz')}
                </button>
                <button
                  onClick={() => onDeleteSubject(subject.id)}
                  className="p-2 rounded-lg bg-red-800 hover:bg-red-700 transition-colors"
                  aria-label={t('deleteSubject')}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={onCreateNew}
        className="w-full py-3 px-6 text-lg font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-6 h-6" />
        {t('createSubject')}
      </button>
    </div>
  );
};

export default SubjectManager;