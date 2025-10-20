import type { Subject } from '../types';

const STORAGE_KEY = 'quizMasterAI_subjects';

export const getSubjects = (): Subject[] => {
  try {
    const subjectsJSON = localStorage.getItem(STORAGE_KEY);
    return subjectsJSON ? JSON.parse(subjectsJSON) : [];
  } catch (error) {
    console.error("Failed to parse subjects from localStorage", error);
    return [];
  }
};

export const saveSubjects = (subjects: Subject[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  } catch (error) {
    console.error("Failed to save subjects to localStorage", error);
  }
};
