export interface UserProgress {
  completedSkills: string[];
  savedCompanies: string[];
  mockInterviews: number;
}

export const progress: Record<string, UserProgress> = {
  // 'user@example.com': { completedSkills: [...], savedCompanies: [...], mockInterviews: 2 },
}; 