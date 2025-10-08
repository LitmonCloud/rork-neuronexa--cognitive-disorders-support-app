export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface TaskStep {
  id: string;
  description: string;
  completed: boolean;
  order: number;
  visualAid?: string;
  audioGuidance?: string;
  simplifiedText?: string;
  contextualPrompt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  steps: TaskStep[];
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
  completeByTime?: string;
  reminderEnabled: boolean;
  tags?: string[];
  memoryAids?: MemoryAid[];
  timeEstimate?: number;
  cognitiveLevel?: 'simple' | 'moderate' | 'complex';
  currentStepIndex?: number;
  repeatCount?: number;
}

export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  voiceGuidance: boolean;
  cognitiveMode: boolean;
  stepByStepMode: boolean;
  autoReadSteps: boolean;
  visualCuesEnabled: boolean;
  simplifiedLanguage: boolean;
  screenReaderOptimized: boolean;
  hapticFeedback: boolean;
  colorBlindMode: ColorBlindMode;
  focusIndicators: boolean;
}

export interface CaregiverSettings {
  enabled: boolean;
  caregiverName?: string;
  notificationsEnabled: boolean;
}

export interface MemoryAid {
  id: string;
  taskId: string;
  type: 'photo' | 'icon' | 'audio';
  uri?: string;
  description?: string;
}
