
export type Section = 'home' | 'cognitive' | 'breathing' | 'stats' | 'trivia' | 'interview';

export interface ScoreRecord {
  id: string;
  type: string;
  score: number;
  date: number;
}

export type CognitiveTestType = 'attention' | 'visual' | 'reaction' | 'nback' | 'digitspan' | 'cpt' | 'gonogo';

export type BreathingType = 'box' | 'mindful' | 'grounding';

export interface TestResult {
  type: CognitiveTestType;
  score: number;
  accuracy: number;
  timeTaken: number;
}

export interface TriviaCard {
  title: string;
  fact: string;
  description: string;
}
