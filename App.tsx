import React, { useState, useCallback, useEffect } from 'react';
import type { Question, QuizState, Subject, QuizAttempt } from './types';
import { generateQuizFromText } from './services/geminiService';
import { getSubjects, saveSubjects } from './services/subjectService';
import SubjectManager from './components/FileUpload'; // FileUpload is now SubjectManager
import NewSubjectView from './components/NewSubjectView';
import Loader from './components/Loader';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import SaveSubjectModal from './components/SaveSubjectModal';
import SubjectDetailsModal from './components/SubjectDetailsModal';
import { useLanguage } from './contexts/LanguageContext';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const BATCH_SIZE = 20;

function App() {
  const { language, setLanguage, t } = useLanguage();
  const [quizState, setQuizState] = useState<QuizState>('subject_selection');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allGeneratedQuestions, setAllGeneratedQuestions] = useState<Question[]>([]);
  const [remainingQuestions, setRemainingQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [wronglyAnswered, setWronglyAnswered] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Subject Management State
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newlyGeneratedText, setNewlyGeneratedText] = useState<string | null>(null);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [detailsModalSubject, setDetailsModalSubject] = useState<Subject | null>(null);

  useEffect(() => {
    setSubjects(getSubjects());
  }, []);
  
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
    setQuizState('subject_selection');
    setQuestions([]);
    setAllGeneratedQuestions([]);
    setRemainingQuestions([]);
    setCurrentQuestionIndex(0);
    setWronglyAnswered([]);
    setScore(0);
    setError(null);
    setIsLoading(false);
    setActiveSubjectId(null);
  };

  const generateQuizForSubject = useCallback(async (subject: Subject) => {
    setIsLoading(true);
    setQuizState('generating');
    setError(null);
    try {
      const generatedQuestions = await generateQuizFromText(subject.content, language);
      if (generatedQuestions.length === 0) {
        throw new Error(t('errorCouldNotGenerate'));
      }
      
      const updatedSubjects = subjects.map(s => 
        s.id === subject.id ? { ...s, questions: generatedQuestions } : s
      );
      setSubjects(updatedSubjects);
      saveSubjects(updatedSubjects);

      setAllGeneratedQuestions(generatedQuestions);
      startNewBatch(generatedQuestions);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(t('quizGenerationFailed', { message }));
      setQuizState('subject_selection');
    } finally {
      setIsLoading(false);
    }
  }, [language, startNewBatch, t, subjects]);

  const generateQuizFromNewText = useCallback(async (text: string) => {
    setIsLoading(true);
    setQuizState('generating');
    setError(null);
    setActiveSubjectId(null);
    try {
      if (!text || text.trim().length < 50) {
         throw new Error(t('errorPastedTextTooShort'));
      }
      const generatedQuestions = await generateQuizFromText(text, language);
      if (generatedQuestions.length === 0) {
        throw new Error(t('errorCouldNotGenerate'));
      }
      setAllGeneratedQuestions(generatedQuestions);
      startNewBatch(generatedQuestions);
      setNewlyGeneratedText(text);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(t('quizGenerationFailed', { message }));
      setQuizState('subject_selection');
    } finally {
      setIsLoading(false);
    }
  }, [language, startNewBatch, t]);

  const handleNewTextSubmit = (text: string) => generateQuizFromNewText(text);

  const handleSubjectSelect = (subject: Subject) => {
    setActiveSubjectId(subject.id);
    if (subject.questions && subject.questions.length > 0) {
      setAllGeneratedQuestions(subject.questions);
      startNewBatch(subject.questions);
    } else {
      generateQuizForSubject(subject);
    }
  };

  const handleSaveSubject = (name: string) => {
    if (!newlyGeneratedText) return;
    const newSubject: Subject = { 
      id: Date.now().toString(), 
      name, 
      content: newlyGeneratedText,
      history: [],
      questions: allGeneratedQuestions, // Cache the questions
    };
    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    saveSubjects(updatedSubjects);
    setNewlyGeneratedText(null);
    setActiveSubjectId(newSubject.id);
  };

  const handleCloseSaveModal = () => {
    setNewlyGeneratedText(null);
    setActiveSubjectId(null);
  };

  const handleDeleteSubject = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      const updatedSubjects = subjects.filter(s => s.id !== id);
      setSubjects(updatedSubjects);
      saveSubjects(updatedSubjects);
    }
  };
  
  const handleAnswerSubmit = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setWronglyAnswered(prev => [...prev, questions[currentQuestionIndex]]);
    }

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
      if (activeSubjectId) {
        const newAttempt: QuizAttempt = {
          date: Date.now(),
          score: isCorrect ? score + 1 : score,
          totalQuestions: questions.length
        };
        const updatedSubjects = subjects.map(s => {
          if (s.id === activeSubjectId) {
            const history = s.history ? [...s.history, newAttempt] : [newAttempt];
            return { ...s, history };
          }
          return s;
        });
        setSubjects(updatedSubjects);
        saveSubjects(updatedSubjects);
      }
      setQuizState('results');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions, score, activeSubjectId, subjects]);

  const handleRestart = useCallback(() => {
    if (allGeneratedQuestions.length > 0) {
        startNewBatch(allGeneratedQuestions);
    }
  }, [allGeneratedQuestions, startNewBatch]);

  const handleReview = useCallback(() => {
    if (wronglyAnswered.length > 0) {
      setActiveSubjectId(null);
      startQuiz(wronglyAnswered);
    }
  }, [wronglyAnswered, startQuiz]);

  const handleNextBatch = useCallback(() => {
    if (remainingQuestions.length > 0) {
        startNewBatch(remainingQuestions);
    }
  }, [remainingQuestions, startNewBatch]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const renderContent = () => {
    switch (quizState) {
      case 'subject_selection':
        return <SubjectManager subjects={subjects} onSelectSubject={handleSubjectSelect} onDeleteSubject={handleDeleteSubject} onCreateNew={() => setQuizState('upload')} onShowDetails={setDetailsModalSubject} />;
      case 'upload':
        return <NewSubjectView onTextSubmit={handleNewTextSubmit} loading={isLoading} onBack={() => setQuizState('subject_selection')} />;
      case 'generating':
        return <Loader />;
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
        <div className="absolute top-5 right-5 flex items-center gap-4 z-10">
          {(quizState !== 'subject_selection' && quizState !== 'upload') && (
            <button
              onClick={handleStartOver}
              className="bg-cyan-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-cyan-500 transition-colors"
            >
              {t('newQuiz')}
            </button>
          )}
          <button
            onClick={toggleLanguage}
            className="bg-slate-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-slate-500 transition-colors"
          >
            {language === 'en' ? '中文' : 'English'}
          </button>
        </div>
        {error && (
            <div className="absolute top-5 left-5 right-5 mx-auto max-w-md bg-red-500 text-white p-3 rounded-lg shadow-lg flex justify-between items-center" role="alert">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="ml-4 font-bold text-xl leading-none">&times;</button>
            </div>
        )}
      
      <SaveSubjectModal 
        isOpen={!!newlyGeneratedText}
        onSave={handleSaveSubject}
        onClose={handleCloseSaveModal}
      />
      <SubjectDetailsModal
        isOpen={!!detailsModalSubject}
        subject={detailsModalSubject}
        onClose={() => setDetailsModalSubject(null)}
      />
      {renderContent()}
    </main>
  );
}

export default App;