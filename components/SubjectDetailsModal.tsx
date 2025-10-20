import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Subject } from '../types';
import ProgressChart from './ProgressChart';

interface SubjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null;
}

const SubjectDetailsModal: React.FC<SubjectDetailsModalProps> = ({ isOpen, onClose, subject }) => {
  const { t } = useLanguage();

  if (!isOpen || !subject) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="subject-details-title"
    >
      <div className="bg-slate-800 rounded-xl p-6 sm:p-8 shadow-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
        <h2 id="subject-details-title" className="text-2xl font-bold text-slate-100 mb-1">{t('learningProgress')}</h2>
        <p className="text-slate-400 mb-6 text-lg">{subject.name}</p>

        <ProgressChart attempts={subject.history || []} />
        
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="py-2 px-6 font-semibold rounded-lg bg-slate-600 hover:bg-slate-500 transition-colors">
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailsModal;