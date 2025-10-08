import { MemoryExercise, OrientationPrompt, SensoryGroundingStep } from '@/types/memoryExercise';
import colors from './colors';

export const memoryExercises: MemoryExercise[] = [
  {
    id: 'orient-1',
    type: 'orientation',
    title: 'Daily Orientation',
    description: 'Simple questions to help you stay oriented',
    duration: 3,
    difficulty: 'easy',
    icon: 'calendar',
    color: colors.primary,
    instructions: [
      'Answer simple questions about today',
      'Take your time',
      'It\'s okay to check if you\'re not sure',
    ],
    benefits: [
      'Helps maintain awareness',
      'Reduces confusion',
      'Builds confidence',
    ],
  },
  {
    id: 'sensory-1',
    type: 'sensory-grounding',
    title: 'What I Notice',
    description: 'Use your senses to feel calm and present',
    duration: 5,
    difficulty: 'easy',
    icon: 'eye',
    color: colors.decorative.mint,
    instructions: [
      'Look around you',
      'Notice what you can see, hear, and feel',
      'Take your time with each step',
    ],
    benefits: [
      'Reduces anxiety',
      'Helps you feel present',
      'Calming and grounding',
    ],
  },
  {
    id: 'breath-1',
    type: 'simple-breathing',
    title: 'Easy Breathing',
    description: 'Simple in and out breathing',
    duration: 3,
    difficulty: 'easy',
    icon: 'wind',
    color: colors.decorative.lavender,
    instructions: [
      'Breathe in slowly',
      'Breathe out slowly',
      'Repeat a few times',
    ],
    benefits: [
      'Reduces stress',
      'Easy to remember',
      'Calms your body',
    ],
  },
  {
    id: 'movement-1',
    type: 'gentle-movement',
    title: 'Gentle Stretches',
    description: 'Simple movements to feel good',
    duration: 5,
    difficulty: 'easy',
    icon: 'move',
    color: colors.accent,
    instructions: [
      'Sit or stand comfortably',
      'Gently move your arms and shoulders',
      'Move at your own pace',
    ],
    benefits: [
      'Improves circulation',
      'Reduces stiffness',
      'Feels good',
    ],
  },
  {
    id: 'music-1',
    type: 'music-memory',
    title: 'Familiar Songs',
    description: 'Listen to songs you know and love',
    duration: 10,
    difficulty: 'easy',
    icon: 'music',
    color: colors.secondary,
    instructions: [
      'Choose a song you like',
      'Listen or sing along',
      'Enjoy the memories',
    ],
    benefits: [
      'Brings back happy memories',
      'Improves mood',
      'Reduces agitation',
    ],
  },
  {
    id: 'photo-1',
    type: 'photo-recall',
    title: 'Photo Memories',
    description: 'Look at familiar photos',
    duration: 10,
    difficulty: 'easy',
    icon: 'image',
    color: colors.decorative.peach,
    instructions: [
      'Look at photos of family or friends',
      'Talk about what you remember',
      'Enjoy the memories',
    ],
    benefits: [
      'Stimulates memory',
      'Brings comfort',
      'Encourages conversation',
    ],
  },
];

export const orientationPrompts: OrientationPrompt[] = [
  {
    question: 'What day is today?',
    type: 'date',
    hint: 'Check the calendar if you need to',
  },
  {
    question: 'What month are we in?',
    type: 'date',
  },
  {
    question: 'What year is it?',
    type: 'date',
  },
  {
    question: 'What time of day is it? (Morning, Afternoon, or Evening)',
    type: 'time',
    hint: 'Look outside or at a clock',
  },
  {
    question: 'Where are you right now?',
    type: 'location',
    hint: 'What room or place are you in?',
  },
  {
    question: 'What is your name?',
    type: 'person',
  },
];

export const sensoryGroundingSteps: SensoryGroundingStep[] = [
  {
    sense: 'see',
    prompt: 'Name 3 things you can see around you',
    count: 3,
  },
  {
    sense: 'hear',
    prompt: 'Name 2 things you can hear right now',
    count: 2,
  },
  {
    sense: 'touch',
    prompt: 'Name 1 thing you can touch or feel',
    count: 1,
  },
];

export const gentleMovements = [
  {
    name: 'Shoulder Rolls',
    instruction: 'Slowly roll your shoulders backward, then forward',
    duration: 30,
  },
  {
    name: 'Arm Raises',
    instruction: 'Gently raise your arms up and down',
    duration: 30,
  },
  {
    name: 'Head Turns',
    instruction: 'Slowly turn your head left, then right',
    duration: 30,
  },
  {
    name: 'Ankle Circles',
    instruction: 'Make circles with your feet',
    duration: 30,
  },
  {
    name: 'Hand Squeezes',
    instruction: 'Open and close your hands gently',
    duration: 30,
  },
];
