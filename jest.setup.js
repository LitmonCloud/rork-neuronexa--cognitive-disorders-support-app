import '@testing-library/jest-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('@rork-ai/toolkit-sdk', () => ({
  generateText: jest.fn(() => Promise.resolve('Mocked AI response')),
  generateObject: jest.fn(() => Promise.resolve({})),
  useRorkAgent: jest.fn(() => ({
    messages: [],
    sendMessage: jest.fn(),
    addToolResult: jest.fn(),
    setMessages: jest.fn(),
  })),
  createRorkTool: jest.fn((config) => config),
}));

global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};
