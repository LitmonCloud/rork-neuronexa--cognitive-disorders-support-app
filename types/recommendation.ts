export type RecommendationType = 
  | 'task'
  | 'breathing'
  | 'resource'
  | 'feature'
  | 'timing'
  | 'wellness'
  | 'habit';

export type RecommendationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: RecommendationPriority;
  reason: string;
  actionLabel: string;
  actionRoute?: string;
  actionCallback?: () => void;
  metadata?: Record<string, any>;
  createdAt: string;
  expiresAt?: string;
  dismissed?: boolean;
  completed?: boolean;
  relevanceScore: number;
}

export interface RecommendationContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number;
  recentTaskCompletions: number;
  recentTaskAbandons: number;
  lastBreathingExercise?: string;
  lastWellnessActivity?: string;
  streakDays: number;
  totalTasksCompleted: number;
  averageCompletionTime?: number;
  preferredTaskTime?: 'morning' | 'afternoon' | 'evening';
  strugglingAreas: string[];
  strengths: string[];
}
