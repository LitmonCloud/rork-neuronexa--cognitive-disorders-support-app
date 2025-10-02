export type TraceShape = 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'infinity' | 'spiral';
export type TraceType = 'shape' | 'letter' | 'number' | 'pattern';

export interface TracePoint {
  x: number;
  y: number;
}

export interface TracePath {
  points: TracePoint[];
  completed: boolean;
}

export interface TraceExercise {
  id: string;
  name: string;
  type: TraceType;
  shape?: TraceShape;
  character?: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  color: string;
  instructions: string[];
  benefits: string[];
}

export interface TraceSession {
  exerciseId: string;
  startTime: number;
  endTime?: number;
  accuracy: number;
  completed: boolean;
  paths: TracePath[];
}
