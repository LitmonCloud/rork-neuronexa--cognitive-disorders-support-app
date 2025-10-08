export interface UserPreference {
  id: string;
  category: 'communication' | 'motivation' | 'timing' | 'task' | 'general';
  preference: string;
  strength: number;
  learnedAt: string;
  lastReinforced?: string;
}

export interface UserHabit {
  id: string;
  pattern: string;
  frequency: number;
  lastObserved: string;
  confidence: number;
}

export interface UserInteraction {
  id: string;
  timestamp: string;
  type: 'task_completed' | 'task_abandoned' | 'step_skipped' | 'feedback_given' | 'encouragement_received' | 'wellness_completed';
  taskId?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  metadata?: Record<string, any>;
}

export interface UserProfile {
  userId: string;
  name?: string;
  role?: 'patient' | 'caregiver';
  patientType?: 'cognitive' | 'memory';
  onboardingCompleted?: boolean;
  preferences: UserPreference[];
  habits: UserHabit[];
  interactions: UserInteraction[];
  communicationStyle: 'casual' | 'formal' | 'encouraging' | 'direct';
  motivationTriggers: string[];
  avoidTopics: string[];
  favoriteEncouragements: string[];
  bestTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  averageTaskDuration?: number;
  completionRate?: number;
  termsAcceptedAt?: string;
  termsVersion?: string;
  createdAt: string;
  updatedAt: string;
}
