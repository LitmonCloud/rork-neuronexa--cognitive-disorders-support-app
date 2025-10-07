import { TraceExercise } from '@/types/fingerTrace';

export const traceExercises: TraceExercise[] = [
  {
    id: 'circle-basic',
    name: 'Circle Trace',
    type: 'shape',
    shape: 'circle',
    description: 'Trace a smooth circle to calm your mind',
    difficulty: 'easy',
    duration: 30,
    color: '#4A90E2',
    instructions: [
      'Place your finger at the starting point',
      'Slowly trace around the circle',
      'Keep a steady, smooth motion',
      'Complete 3 full circles'
    ],
    benefits: [
      'Reduces anxiety',
      'Improves focus',
      'Calms racing thoughts'
    ]
  },
  {
    id: 'square-basic',
    name: 'Square Trace',
    type: 'shape',
    shape: 'square',
    description: 'Trace a square with deliberate corners',
    difficulty: 'easy',
    duration: 35,
    color: '#50C878',
    instructions: [
      'Start at the top-left corner',
      'Trace each side slowly',
      'Pause briefly at each corner',
      'Complete 3 full squares'
    ],
    benefits: [
      'Builds concentration',
      'Grounds your attention',
      'Structured calming'
    ]
  },
  {
    id: 'triangle-basic',
    name: 'Triangle Trace',
    type: 'shape',
    shape: 'triangle',
    description: 'Trace a triangle with three smooth sides',
    difficulty: 'easy',
    duration: 30,
    color: '#FFB347',
    instructions: [
      'Begin at the top point',
      'Trace down to the bottom-left',
      'Move to bottom-right',
      'Return to the top'
    ],
    benefits: [
      'Enhances coordination',
      'Mindful movement',
      'Stress relief'
    ]
  },
  {
    id: 'infinity-medium',
    name: 'Infinity Symbol',
    type: 'shape',
    shape: 'infinity',
    description: 'Trace the infinity symbol (∞) for continuous flow',
    difficulty: 'medium',
    duration: 45,
    color: '#9B59B6',
    instructions: [
      'Start at the center point',
      'Trace a smooth sideways figure-8',
      'Keep the motion fluid and continuous',
      'Complete 4 full loops'
    ],
    benefits: [
      'Bilateral brain stimulation',
      'Deep relaxation',
      'Improved focus'
    ]
  },
  {
    id: 'star-medium',
    name: 'Star Trace',
    type: 'shape',
    shape: 'star',
    description: 'Trace a five-pointed star',
    difficulty: 'medium',
    duration: 40,
    color: '#F39C12',
    instructions: [
      'Start at the top point',
      'Trace each point in sequence',
      'Maintain steady pressure',
      'Complete 3 full stars'
    ],
    benefits: [
      'Improves precision',
      'Enhances patience',
      'Calming ritual'
    ]
  },
  {
    id: 'heart-medium',
    name: 'Heart Trace',
    type: 'shape',
    shape: 'heart',
    description: 'Trace a heart shape for self-compassion',
    difficulty: 'medium',
    duration: 35,
    color: '#E74C3C',
    instructions: [
      'Begin at the top center',
      'Trace the left curve down',
      'Move to the point at bottom',
      'Complete the right curve'
    ],
    benefits: [
      'Self-compassion practice',
      'Emotional regulation',
      'Positive focus'
    ]
  },
  {
    id: 'spiral-hard',
    name: 'Spiral Trace',
    type: 'shape',
    shape: 'spiral',
    description: 'Trace an expanding spiral from center outward',
    difficulty: 'hard',
    duration: 50,
    color: '#1ABC9C',
    instructions: [
      'Start near the center',
      'Slowly spiral outward in circular motion',
      'Maintain smooth, consistent spacing',
      'Follow the path to the outer edge'
    ],
    benefits: [
      'Deep concentration',
      'Meditative state',
      'Advanced mindfulness'
    ]
  },
  {
    id: 'letter-a',
    name: 'Letter A',
    type: 'letter',
    character: 'A',
    description: 'Trace the uppercase letter A',
    difficulty: 'easy',
    duration: 25,
    color: '#3498DB',
    instructions: [
      'Start at bottom-left',
      'Trace up to the peak',
      'Trace down to bottom-right',
      'Add the horizontal crossbar'
    ],
    benefits: [
      'Letter recognition',
      'Fine motor skills',
      'Focus building'
    ]
  },
  {
    id: 'number-8',
    name: 'Number 8',
    type: 'number',
    character: '8',
    description: 'Trace the number 8 with two connected loops',
    difficulty: 'medium',
    duration: 35,
    color: '#E67E22',
    instructions: [
      'Start at the top center',
      'Trace the upper oval clockwise',
      'Continue smoothly to lower oval',
      'Complete both loops continuously'
    ],
    benefits: [
      'Number familiarity',
      'Continuous motion',
      'Calming repetition'
    ]
  }
];

export const getExercisesByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
  return traceExercises.filter(ex => ex.difficulty === difficulty);
};

export const getExercisesByType = (type: TraceExercise['type']) => {
  return traceExercises.filter(ex => ex.type === type);
};
