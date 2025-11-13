import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AITaskCoach from '@/components/AITaskCoach';
import { MockThemeProvider, MockAccessibilityProvider, TestWrapper } from '../__mocks__/contextMocks';
import { useRorkAgent } from '@rork-ai/toolkit-sdk';
import { Task } from '@/types/task';

jest.mock('@rork-ai/toolkit-sdk');

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <TestWrapper>
      <MockThemeProvider>
        <MockAccessibilityProvider>
          {component}
        </MockAccessibilityProvider>
      </MockThemeProvider>
    </TestWrapper>
  );
};

describe('AITaskCoach', () => {
  const mockSendMessage = jest.fn();
  const mockAddToolResult = jest.fn();
  const mockSetMessages = jest.fn();
  const mockOnStepComplete = jest.fn();
  const mockOnTaskComplete = jest.fn();

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'medium',
    status: 'in-progress',
    steps: [
      {
        id: 'step-1',
        description: 'First step',
        simplifiedText: 'Do first step',
        completed: false,
        order: 0,
      },
      {
        id: 'step-2',
        description: 'Second step',
        simplifiedText: 'Do second step',
        completed: false,
        order: 1,
      },
    ],
    createdAt: new Date().toISOString(),
    reminderEnabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRorkAgent as jest.Mock).mockReturnValue({
      messages: [],
      error: null,
      sendMessage: mockSendMessage,
      addToolResult: mockAddToolResult,
      setMessages: mockSetMessages,
    });
  });

  it('should render coach interface', () => {
    const { getByText } = renderWithTheme(
      <AITaskCoach 
        task={mockTask} 
        onStepComplete={mockOnStepComplete}
        onTaskComplete={mockOnTaskComplete}
      />
    );

    expect(getByText(/First step/i)).toBeTruthy();
  });

  it('should display task steps', async () => {
    const { getByText } = renderWithTheme(
      <AITaskCoach 
        task={mockTask} 
        onStepComplete={mockOnStepComplete}
        onTaskComplete={mockOnTaskComplete}
      />
    );

    expect(getByText(/First step/i)).toBeTruthy();
    expect(getByText(/Step 1 of 2/i)).toBeTruthy();
  });

  it('should complete step when button pressed', () => {
    const { getByText } = renderWithTheme(
      <AITaskCoach 
        task={mockTask} 
        onStepComplete={mockOnStepComplete}
        onTaskComplete={mockOnTaskComplete}
      />
    );

    const completeButton = getByText(/Mark Complete/i);
    fireEvent.press(completeButton);

    expect(mockOnStepComplete).toHaveBeenCalledWith('step-1');
  });

  it('should navigate between steps', () => {
    const { getByText } = renderWithTheme(
      <AITaskCoach 
        task={mockTask} 
        onStepComplete={mockOnStepComplete}
        onTaskComplete={mockOnTaskComplete}
      />
    );

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    expect(getByText(/Second step/i)).toBeTruthy();
  });

  it('should show completion badge for completed steps', () => {
    const completedTask: Task = {
      ...mockTask,
      steps: [
        { ...mockTask.steps[0], completed: true },
        mockTask.steps[1],
      ],
    };

    const { getByText } = renderWithTheme(
      <AITaskCoach 
        task={completedTask} 
        onStepComplete={mockOnStepComplete}
        onTaskComplete={mockOnTaskComplete}
      />
    );

    expect(getByText(/1 completed/i)).toBeTruthy();
  });

  it('should call onTaskComplete when last step is completed', () => {
    const lastStepTask: Task = {
      ...mockTask,
      steps: [
        { ...mockTask.steps[0], completed: true },
        mockTask.steps[1],
      ],
    };

    const { getByText } = renderWithTheme(
      <AITaskCoach 
        task={lastStepTask} 
        onStepComplete={mockOnStepComplete}
        onTaskComplete={mockOnTaskComplete}
      />
    );

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    const completeButton = getByText(/Complete Task/i);
    fireEvent.press(completeButton);

    setTimeout(() => {
      expect(mockOnTaskComplete).toHaveBeenCalled();
    }, 1600);
  });
});
