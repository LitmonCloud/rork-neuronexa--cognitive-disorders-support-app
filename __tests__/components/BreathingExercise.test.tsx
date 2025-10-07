import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import BreathingExercise from '@/components/BreathingExercise';
import { ThemeProvider } from '@/contexts/ThemeContext';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('BreathingExercise', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render breathing exercise', () => {
    const { getByText } = renderWithTheme(<BreathingExercise />);

    expect(getByText(/breathe/i)).toBeTruthy();
  });

  it('should start exercise when button is pressed', () => {
    const { getByText } = renderWithTheme(<BreathingExercise />);

    const startButton = getByText(/start/i);
    fireEvent.press(startButton);

    expect(getByText(/breathe in/i)).toBeTruthy();
  });

  it('should cycle through breathing phases', () => {
    const { getByText } = renderWithTheme(<BreathingExercise />);

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

  it('should stop exercise when stop button is pressed', () => {
    const { getByText, queryByText } = renderWithTheme(<BreathingExercise />);

    const startButton = getByText(/start/i);
    fireEvent.press(startButton);

    const stopButton = getByText(/stop/i);
    fireEvent.press(stopButton);

    expect(queryByText(/breathe in/i)).toBeFalsy();
  });

  it('should call onComplete callback when exercise finishes', () => {
    const onComplete = jest.fn();
    const { getByText } = renderWithTheme(
      <BreathingExercise onComplete={onComplete} duration={12} />
    );

    const startButton = getByText(/start/i);
    fireEvent.press(startButton);

    act(() => {
      jest.advanceTimersByTime(13000);
    });

    expect(onComplete).toHaveBeenCalled();
  });

  it('should display progress', () => {
    const { getByText } = renderWithTheme(<BreathingExercise duration={60} />);

    const startButton = getByText(/start/i);
    fireEvent.press(startButton);

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(getByText(/30/)).toBeTruthy();
  });
});
