import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SaveSubjectModalProps {
  isOpen: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
}

const SaveSubjectModal: React.FC<SaveSubjectModalProps> = ({ isOpen, onSave, onClose }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-subject-title"
    >
      <div className="bg-slate-800 rounded-xl p-8 shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h2 id="save-subject-title" className="text-2xl font-bold text-slate-100 mb-2">{t('saveSubjectTitle')}</h2>
        <p className="text-slate-400 mb-6">{t('saveSubjectPrompt')}</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('subjectNamePlaceholder')}
          className="w-full p-3 bg-slate-700 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-200 placeholder-slate-500"
          autoFocus
        />
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="py-2 px-5 font-semibold rounded-lg bg-slate-600 hover:bg-slate-500 transition-colors">
            {t('dontSave')}
          </button>
          <button onClick={handleSave} disabled={!name.trim()} className="py-2 px-5 font-semibold rounded-lg bg-teal-500 hover:bg-teal-600 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors">
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveSubjectModal;