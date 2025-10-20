import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Language } from '../types';

const translations = {
  en: {
    appTitle: "Quiz Master AI",
    appSubtitle: "Paste your study material below to create a practice quiz.",
    pastePlaceholder: "Paste your study material here...",
    generateQuiz: "Generate Quiz",
    buildingQuiz: "Building Your Quiz...",
    aiAnalyzing: "The AI is analyzing your document and building the quiz...",
    questionOf: "Question {current} / {total}",
    multipleAnswers: "(Multiple answers may be correct)",
    submitAnswer: "Submit Answer",
    correct: "Correct!",
    incorrect: "Incorrect",
    nextQuestion: "Next Question",
    perfectScore: "Perfect Score!",
    excellentWork: "Excellent Work!",
    goodEffort: "Good Effort!",
    keepPracticing: "Keep Practicing!",
    youAnswered: "You answered",
    nextBatch: "Next Batch",
    reviewMistakes: "Review Mistakes",
    restartQuiz: "Restart Quiz",
    newQuiz: "New Quiz",
    errorTooShort: "Please paste at least 50 characters to generate a quiz.",
    quizGenerationFailed: "Quiz Generation Failed: {message}",
    errorPastedTextTooShort: "Pasted text is too short.",
    errorCouldNotGenerate: "Could not generate a quiz from the provided text. The content might not be suitable.",
    savedSubjects: "Saved Subjects",
    noSubjects: "No subjects saved yet. Create one to get started!",
    createSubject: "Create New Subject",
    startQuiz: "Start Quiz",
    deleteSubject: "Delete",
    confirmDelete: "Are you sure you want to delete this subject?",
    saveSubjectTitle: "Save Subject",
    saveSubjectPrompt: "Enter a name for your new subject to save it for later.",
    subjectNamePlaceholder: "e.g., Chapter 1 Biology",
    save: "Save",
    dontSave: "Don't Save",
    backToSubjects: "Back to Subjects",
    viewDetails: "Details",
    learningProgress: "Learning Progress",
    noHistory: "No quiz history yet. Complete a quiz to see your progress!",
    notEnoughHistory: "Complete at least two quizzes to see a progress chart.",
    score: "Score",
    date: "Date",
    close: "Close",
  },
  zh: {
    appTitle: "测验大师 AI",
    appSubtitle: "在下方粘贴您的学习材料以创建练习测验。",
    pastePlaceholder: "在此处粘贴您的学习材料...",
    generateQuiz: "生成测验",
    buildingQuiz: "正在构建您的测验...",
    aiAnalyzing: "AI 正在分析您的文档并构建测验...",
    questionOf: "问题 {current} / {total}",
    multipleAnswers: "（可能有多个正确答案）",
    submitAnswer: "提交答案",
    correct: "正确！",
    incorrect: "错误",
    nextQuestion: "下一题",
    perfectScore: "满分！",
    excellentWork: "干得漂亮！",
    goodEffort: "不错！",
    keepPracticing: "继续练习！",
    youAnswered: "您答对了",
    nextBatch: "下一批",
    reviewMistakes: "复习错题",
    restartQuiz: "重新开始测验",
    newQuiz: "新测验",
    errorTooShort: "请粘贴至少50个字符以生成测验。",
    quizGenerationFailed: "测验生成失败: {message}",
    errorPastedTextTooShort: "粘贴的文本太短。",
    errorCouldNotGenerate: "无法根据提供的文本生成测验。内容可能不合适。",
    savedSubjects: "已保存的科目",
    noSubjects: "尚未保存任何科目。创建一个开始吧！",
    createSubject: "创建新科目",
    startQuiz: "开始测验",
    deleteSubject: "删除",
    confirmDelete: "您确定要删除此科目吗？",
    saveSubjectTitle: "保存科目",
    saveSubjectPrompt: "为您的新科目输入一个名称以便以后使用。",
    subjectNamePlaceholder: "例如，生物学第一章",
    save: "保存",
    dontSave: "不保存",
    backToSubjects: "返回科目列表",
    viewDetails: "详情",
    learningProgress: "学习进度",
    noHistory: "暂无测验历史。完成一次测验来查看您的进度！",
    notEnoughHistory: "完成至少两次测验以查看进度图表。",
    score: "分数",
    date: "日期",
    close: "关闭",
  }
};

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey, replacements?: Record<string, string | number>): string => {
    let translation = (translations[language] && translations[language][key]) || translations.en[key];
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        translation = translation.replace(`{${rKey}}`, String(replacements[rKey]));
      });
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};