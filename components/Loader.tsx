
import React from 'react';
import { BrainIcon } from './icons';

const Loader: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <BrainIcon className="h-24 w-24 mx-auto text-cyan-400 mb-6 animate-pulse"/>
      <h2 className="text-2xl font-semibold text-slate-300 mb-2">{message}</h2>
      <p className="text-slate-400">The AI is analyzing your document and building the quiz...</p>
    </div>
  );
};

export default Loader;
