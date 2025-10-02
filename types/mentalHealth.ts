export type ResourceCategory = 'crisis' | 'therapy' | 'support' | 'education' | 'breathing';

export interface MentalHealthResource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  url?: string;
  phone?: string;
  available24x7?: boolean;
  icon: string;
}

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfterExhale?: number;
  cycles: number;
  color: string;
}
