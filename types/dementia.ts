export interface DementiaSettings {
  enabled: boolean;
  orientationRemindersEnabled: boolean;
  orientationFrequency: number;
  locationTrackingEnabled: boolean;
  geofenceEnabled: boolean;
  safeZoneRadius: number;
  medicationRemindersEnabled: boolean;
  repetitionToleranceEnabled: boolean;
  memoryJournalEnabled: boolean;
  emergencyContactsEnabled: boolean;
  photoBasedNavigationEnabled: boolean;
  autoReadStepsEnabled: boolean;
  aiStepCoachEnabled: boolean;
}

export interface OrientationInfo {
  date: string;
  time: string;
  dayOfWeek: string;
  location?: string;
  weather?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  photoUri?: string;
  isPrimary: boolean;
  order: number;
}

export interface MedicationReminder {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: 'daily' | 'twice-daily' | 'three-times-daily' | 'as-needed';
  times: string[];
  photoUri?: string;
  instructions?: string;
  lastTaken?: string;
  missedDoses: number;
}

export interface MemoryJournalEntry {
  id: string;
  date: string;
  title: string;
  description?: string;
  photoUris: string[];
  audioUri?: string;
  location?: string;
  people?: string[];
  mood?: 'happy' | 'sad' | 'neutral' | 'confused' | 'anxious';
  tags?: string[];
}

export interface SafeZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  isActive: boolean;
  alertContacts: string[];
}

export interface DailyRoutineAnchor {
  id: string;
  time: string;
  title: string;
  description: string;
  photoUri?: string;
  audioGuidance?: string;
  location?: string;
  isRecurring: boolean;
  daysOfWeek: number[];
  reminderMinutesBefore: number;
}

export interface CognitiveAssessment {
  id: string;
  date: string;
  type: 'orientation' | 'memory' | 'attention' | 'language';
  score: number;
  maxScore: number;
  notes?: string;
  concernLevel: 'low' | 'medium' | 'high';
}

export interface RepetitiveQuestion {
  question: string;
  answer: string;
  askedCount: number;
  lastAsked: string;
  photoUri?: string;
}
