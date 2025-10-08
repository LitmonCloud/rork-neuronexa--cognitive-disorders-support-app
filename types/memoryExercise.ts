export type MemoryExerciseType = 
  | 'orientation' 
  | 'sensory-grounding' 
  | 'simple-breathing'
  | 'gentle-movement'
  | 'music-memory'
  | 'photo-recall';

export interface MemoryExercise {
  id: string;
  type: MemoryExerciseType;
  title: string;
  description: string;
  duration: number;
  difficulty: 'easy' | 'medium';
  icon: string;
  color: string;
  instructions: string[];
  benefits: string[];
}

export interface OrientationPrompt {
  question: string;
  type: 'date' | 'time' | 'location' | 'person';
  hint?: string;
}

export interface SensoryGroundingStep {
  sense: 'see' | 'hear' | 'touch' | 'smell' | 'taste';
  prompt: string;
  count: number;
}
