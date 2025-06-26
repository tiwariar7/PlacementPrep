import { create } from 'zustand';
import { Company } from '../data/companies';

interface AppState {
  savedCompanies: string[];
  completedSkills: string[];
  userProfile: {
    name: string;
    branch: string;
    currentYear: string;
    targetPackage: string;
  };
  setSavedCompanies: (companies: string[]) => void;
  addSavedCompany: (companyId: string) => void;
  removeSavedCompany: (companyId: string) => void;
  setCompletedSkills: (skills: string[]) => void;
  addCompletedSkill: (skill: string) => void;
  removeCompletedSkill: (skill: string) => void;
  setUserProfile: (profile: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  savedCompanies: [],
  completedSkills: [],
  userProfile: {
    name: '',
    branch: '',
    currentYear: '',
    targetPackage: ''
  },
  setSavedCompanies: (companies) => set({ savedCompanies: companies }),
  addSavedCompany: (companyId) => set((state) => ({
    savedCompanies: [...state.savedCompanies, companyId]
  })),
  removeSavedCompany: (companyId) => set((state) => ({
    savedCompanies: state.savedCompanies.filter(id => id !== companyId)
  })),
  setCompletedSkills: (skills) => set({ completedSkills: skills }),
  addCompletedSkill: (skill) => set((state) => ({
    completedSkills: [...state.completedSkills, skill]
  })),
  removeCompletedSkill: (skill) => set((state) => ({
    completedSkills: state.completedSkills.filter(s => s !== skill)
  })),
  setUserProfile: (profile) => set({ userProfile: profile })
}));