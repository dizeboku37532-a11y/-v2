import React, { useState } from 'react';
import { BrainIcon } from './icons';

interface InputViewProps {
  onTextSubmit: (text: string) => void;
  loading: boolean;
}

const InputView: React.FC<InputViewProps> = ({ onTextSubmit, loading }) => {
  const [pastedText, setPastedText] = useState('');

  const handleTextGenerate = () => {
    if (pastedText.trim().length < 50) {
      alert("Please paste at least 50 characters to generate a quiz.");
      return;
    }
    onTextSubmit(pastedText);
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center p-8">
      <BrainIcon className="h-24 w-24 mx-auto text-cyan-400 mb-4"/>
      <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">Quiz Master AI</h1>
      <p className="text-slate-400 mb-8 text-lg">Paste your study material below to create a practice quiz.</p>

      <div>
        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="Paste your study material here..."
          disabled={loading}
          className="w-full h-48 p-4 bg-slate-800 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-slate-200 placeholder-slate-500"
        ></textarea>
        <button 
          onClick={handleTextGenerate}
          disabled={loading || pastedText.trim().length === 0}
          className="mt-4 w-full py-3 px-6 text-lg font-semibold rounded-lg bg-teal-500 hover:bg-teal-600 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          Generate Quiz
        </button>
      </div>
    </div>
  );
};

export default InputView;