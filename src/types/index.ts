export interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher';
  name?: string;
}

export interface StudentProgress {
  score: number;
  streak: number;
  badges: Badge[];
  level: number;
  problemsSolved: number;
  timeSpent: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'gold' | 'silver' | 'bronze';
  earnedAt: Date;
}

export interface MathProblem {
  id: string;
  problem: string;
  answer: number;
  difficulty: number;
  type: 'addition' | 'subtraction' | 'multiplication' | 'division';
}

export interface QuizSession {
  id: string;
  problems: MathProblem[];
  startTime: Date;
  endTime?: Date;
  score: number;
  duration: number;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
  rank: number;
}