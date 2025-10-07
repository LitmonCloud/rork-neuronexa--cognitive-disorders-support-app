import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import BreathingExercise from '@/components/BreathingExercise';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { BreathingPattern } from '@/types/mentalHealth';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('BreathingExercise', () => {
  const mockPattern: BreathingPattern = {
    id: '1',
    name: 'Box Breathing',
    description: 'Equal breathing',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4,
    cycles: 3,
    color: '#4A90E2',
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render breathing exercise', () => {
    const { getByText } = renderWithTheme(<BreathingExercise pattern={mockPattern} />);

    expect(getByText(/breathe/i)).toBeTruthy();
  });

  it('should start exercise when button is pressed', () => {
    const { getByText } = renderWithTheme(<BreathingExercise pattern={mockPattern} />);

    const startButton = getByText(/start/i);
    fireEvent.press(startButton);

    expect(getByText(/breathe in/i)).toBeTruthy();
  });

  it('should cycle through breathing phases', () => {
    const { getByText } = renderWithTheme(<BreathingExercise pattern={mockPattern} />);

    const startButton = getByText(/start/i);
    fireEvent.press(startButton);

    expect(getByText(/breathe in/i)).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(getByText(/hold/i)).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(getByText(/breathe out/i)).toBeTruthy();
  });

  it('should pause exercise when pause button is pressed', () => {
    const { getByText } = renderWithTheme(<BreathingExercise pattern={mockPattern} />);

    const startButton = getByText(/start/i);
    fireEvent.press(startButton);

    const pauseButton = getByText(/pause/i);
    fireEvent.press(pauseButton);

    expect(getByText(/start/i)).toBeTruthy();
  });

  it('should call onComplete callback when exercise finishes', () => {
    const onComplete = jest.fn();
    const shortPattern: BreathingPattern = {
      ...mockPattern,
      cycles: 1,
      inhale: 1,
      hold: 1,
      exhale: 1,
      holdAfterExhale: 1,
    };
    const { getByText } = renderWithTheme(
      <BreathingExercise pattern={shortPattern} onComplete={onComplete} />
    );

    const startButton = getByText(/start/i);
    fireEvent.press(startButton);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(onComplete).toHaveBeenCalled();
  });

  it('should display cycle progress', () => {
    const { getByText } = renderWithTheme(<BreathingExercise pattern={mockPattern} />);

    expect(getByText(/Cycle 1 of 3/i)).toBeTruthy();
  });
});
