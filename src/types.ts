export interface User {
  fullName: string;
  loginTime: string;
  logoutTime?: string;
  preTestScore?: number;
  postTestScore?: number;
  unlocked: boolean;
  role?: 'student' | 'admin';
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface LeaderboardRow {
  name: string;
  preScore: number;
  postScore: number;
  improvement: number;
  loginTime: string;
  logoutTime: string;
}

export interface MatchingItem {
  id: string;
  text: string;
  type: 'operator' | 'meaning';
  matchedId?: string;
}
