export interface Streak {
  current: number;
  longest: number;
  lastCompletionDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export const ACHIEVEMENTS: Omit<Achievement, 'progress' | 'unlockedAt'>[] = [
  {
    id: 'first_task',
    title: 'First Steps',
    description: 'Complete your first task',
    icon: 'CheckCircle',
    target: 1,
  },
  {
    id: 'five_tasks',
    title: 'Getting Started',
    description: 'Complete 5 tasks',
    icon: 'Zap',
    target: 5,
  },
  {
    id: 'ten_tasks',
    title: 'Building Momentum',
    description: 'Complete 10 tasks',
    icon: 'TrendingUp',
    target: 10,
  },
  {
    id: 'streak_3',
    title: '3-Day Streak',
    description: 'Complete tasks for 3 days in a row',
    icon: 'Flame',
    target: 3,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Complete tasks for 7 days in a row',
    icon: 'Award',
    target: 7,
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Complete tasks for 30 days in a row',
    icon: 'Crown',
    target: 30,
  },
];
