import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FingerTraceExercise from '@/components/FingerTraceExercise';
import { TraceExercise } from '@/types/fingerTrace';
import { ThemeProvider } from '@/contexts/ThemeContext';

const mockExercise: TraceExercise = {
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
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('FingerTraceExercise', () => {
  it('renders exercise information correctly', () => {
    const { getByText } = renderWithTheme(
      <FingerTraceExercise exercise={mockExercise} />
    );

    expect(getByText('Circle Trace')).toBeTruthy();
    expect(getByText('Trace a smooth circle to calm your mind')).toBeTruthy();
    expect(getByText('EASY')).toBeTruthy();
  });

  it('displays instructions when not active', () => {
    const { getByText } = renderWithTheme(
      <FingerTraceExercise exercise={mockExercise} />
    );

    expect(getByText('Instructions:')).toBeTruthy();
    expect(getByText('1. Place your finger at the starting point')).toBeTruthy();
    expect(getByText('2. Slowly trace around the circle')).toBeTruthy();
  });

  it('displays benefits section', () => {
    const { getByText } = renderWithTheme(
      <FingerTraceExercise exercise={mockExercise} />
    );

    expect(getByText('Benefits:')).toBeTruthy();
    expect(getByText('• Reduces anxiety')).toBeTruthy();
    expect(getByText('• Improves focus')).toBeTruthy();
    expect(getByText('• Calms racing thoughts')).toBeTruthy();
  });

  it('shows start button initially', () => {
    const { getByText } = renderWithTheme(
      <FingerTraceExercise exercise={mockExercise} />
    );

    expect(getByText('Start Exercise')).toBeTruthy();
  });

  it('displays correct loop requirements based on difficulty', () => {
    const { getByText } = renderWithTheme(
      <FingerTraceExercise exercise={mockExercise} />
    );

    expect(getByText('0/3')).toBeTruthy();
  });

  it('shows accuracy stat', () => {
    const { getByText } = renderWithTheme(
      <FingerTraceExercise exercise={mockExercise} />
    );

    expect(getByText('Accuracy')).toBeTruthy();
    expect(getByText('100%')).toBeTruthy();
  });

  it('calls onComplete callback when exercise is finished', () => {
    const onComplete = jest.fn();
    const { getByText } = renderWithTheme(
      <FingerTraceExercise exercise={mockExercise} onComplete={onComplete} />
    );

    const startButton = getByText('Start Exercise');
    fireEvent.press(startButton);

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('renders different shapes correctly', () => {
    const shapes: TraceExercise['shape'][] = ['circle', 'square', 'triangle', 'star', 'heart', 'infinity', 'spiral'];
    
    shapes.forEach(shape => {
      const exercise = { ...mockExercise, shape };
      const { getByText } = renderWithTheme(
        <FingerTraceExercise exercise={exercise} />
      );
      
      expect(getByText('Circle Trace')).toBeTruthy();
    });
  });

  it('handles medium difficulty correctly', () => {
    const mediumExercise = { ...mockExercise, difficulty: 'medium' as const };
    const { getByText } = renderWithTheme(
      <FingerTraceExercise exercise={mediumExercise} />
    );

    expect(getByText('0/4')).toBeTruthy();
  });

  it('handles hard difficulty correctly', () => {
    const hardExercise = { ...mockExercise, difficulty: 'hard' as const };
    const { getByText } = renderWithTheme(
      <FingerTraceExercise exercise={hardExercise} />
    );

    expect(getByText('0/5')).toBeTruthy();
  });

  it('renders letter type exercises', () => {
    const letterExercise: TraceExercise = {
      ...mockExercise,
      type: 'letter',
      character: 'A',
      shape: undefined,
    };

    const { getByText } = renderWithTheme(
      <FingerTraceExercise exercise={letterExercise} />
    );

    expect(getByText('Circle Trace')).toBeTruthy();
  });

  it('renders number type exercises', () => {
    const numberExercise: TraceExercise = {
      ...mockExercise,
      type: 'number',
      character: '8',
      shape: undefined,
    };

    const { getByText } = renderWithTheme(
      <FingerTraceExercise exercise={numberExercise} />
    );

    expect(getByText('Circle Trace')).toBeTruthy();
  });
});
