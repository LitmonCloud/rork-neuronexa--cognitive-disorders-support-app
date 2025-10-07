import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AITaskCoach from '@/components/AITaskCoach';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useRorkAgent } from '@rork/toolkit-sdk';

jest.mock('@rork/toolkit-sdk');

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('AITaskCoach', () => {
  const mockSendMessage = jest.fn();
  const mockAddToolResult = jest.fn();
  const mockSetMessages = jest.fn();

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
    const { getByPlaceholderText } = renderWithTheme(<AITaskCoach />);

    expect(getByPlaceholderText(/ask me anything/i)).toBeTruthy();
  });

  it('should send message when user types and submits', async () => {
    const { getByPlaceholderText, getByTestId } = renderWithTheme(<AITaskCoach />);

    const input = getByPlaceholderText(/ask me anything/i);
    const sendButton = getByTestId('send-button');

    fireEvent.changeText(input, 'Help me with my task');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('Help me with my task');
    });
  });

  it('should display messages', () => {
    (useRorkAgent as jest.Mock).mockReturnValue({
      messages: [
        {
          id: '1',
          role: 'user',
          parts: [{ type: 'text', text: 'Hello' }],
        },
        {
          id: '2',
          role: 'assistant',
          parts: [{ type: 'text', text: 'Hi! How can I help?' }],
        },
      ],
      error: null,
      sendMessage: mockSendMessage,
      addToolResult: mockAddToolResult,
      setMessages: mockSetMessages,
    });

    const { getByText } = renderWithTheme(<AITaskCoach />);

    expect(getByText('Hello')).toBeTruthy();
    expect(getByText('Hi! How can I help?')).toBeTruthy();
  });

  it('should show error state', () => {
    (useRorkAgent as jest.Mock).mockReturnValue({
      messages: [],
      error: new Error('Connection failed'),
      sendMessage: mockSendMessage,
      addToolResult: mockAddToolResult,
      setMessages: mockSetMessages,
    });

    const { getByText } = renderWithTheme(<AITaskCoach />);

    expect(getByText(/error/i)).toBeTruthy();
  });

  it('should disable send button when input is empty', () => {
    const { getByTestId } = renderWithTheme(<AITaskCoach />);

    const sendButton = getByTestId('send-button');

    expect(sendButton.props.accessibilityState.disabled).toBe(true);
  });

  it('should enable send button when input has text', () => {
    const { getByPlaceholderText, getByTestId } = renderWithTheme(<AITaskCoach />);

    const input = getByPlaceholderText(/ask me anything/i);
    const sendButton = getByTestId('send-button');

    fireEvent.changeText(input, 'Test message');

    expect(sendButton.props.accessibilityState.disabled).toBe(false);
  });
});
