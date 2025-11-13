import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a test query client with default options
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

// Test wrapper with QueryClient
export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// TaskContext mock
export const mockTaskContext = {
  tasks: [],
  filter: 'all' as const,
  setFilter: jest.fn(),
  addTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  toggleTaskStatus: jest.fn(),
  breakdownTask: jest.fn(),
  filteredTasks: [],
  isLoading: false,
  error: null,
};

// SubscriptionContext mock
export const mockSubscriptionContext = {
  isLoading: false,
  isSubscribed: false,
  requiresSubscription: false,
  subscriptionStatus: null,
  offerings: null,
  customerInfo: null,
  purchasePackage: jest.fn(),
  restorePurchases: jest.fn(),
  checkSubscriptionStatus: jest.fn(),
};

// DementiaContext mock
export const mockDementiaContext = {
  memoryJournals: [],
  photoMemories: [],
  conversationActivities: [],
  meditationSessions: [],
  addMemoryJournal: jest.fn(),
  updateMemoryJournal: jest.fn(),
  deleteMemoryJournal: jest.fn(),
  addPhotoMemory: jest.fn(),
  updatePhotoMemory: jest.fn(),
  deletePhotoMemory: jest.fn(),
  getConversationActivities: jest.fn(),
  completeMeditation: jest.fn(),
  isLoading: false,
  error: null,
};

// UserProfileContext mock
export const mockUserProfileContext = {
  profile: {
    id: 'test-user',
    onboardingCompleted: true,
    role: 'patient' as const,
    name: 'Test User',
    email: 'test@example.com',
  },
  isLoading: false,
  error: null,
  updateProfile: jest.fn(),
  completeOnboarding: jest.fn(),
};

// ThemeContext mock
export const mockThemeContext = {
  theme: 'light' as const,
  toggleTheme: jest.fn(),
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    text: '#000000',
    border: '#C7C7CC',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
  },
};

// CaregiverContext mock
export const mockCaregiverContext = {
  patients: [],
  inviteCode: null,
  connectedCaregivers: [],
  isLoading: false,
  error: null,
  generateInviteCode: jest.fn(),
  redeemInviteCode: jest.fn(),
  removePatient: jest.fn(),
  removeCaregiver: jest.fn(),
  sendAlert: jest.fn(),
};

// LocationContext mock
export const mockLocationContext = {
  currentLocation: null,
  isTracking: false,
  error: null,
  startTracking: jest.fn(),
  stopTracking: jest.fn(),
  requestPermissions: jest.fn(),
  updateLocation: jest.fn(),
};

// NotificationContext mock
export const mockNotificationContext = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  markAsRead: jest.fn(),
  markAllAsRead: jest.fn(),
  deleteNotification: jest.fn(),
  sendNotification: jest.fn(),
};

// RetentionContext mock
export const mockRetentionContext = {
  shouldShowPrompt: false,
  lastPromptDate: null,
  dismissPrompt: jest.fn(),
  recordEngagement: jest.fn(),
  checkRetentionTriggers: jest.fn(),
};

// FunnelContext mock
export const mockFunnelContext = {
  currentStep: 0,
  totalSteps: 5,
  completedSteps: [],
  isComplete: false,
  nextStep: jest.fn(),
  previousStep: jest.fn(),
  goToStep: jest.fn(),
  completeStep: jest.fn(),
  resetFunnel: jest.fn(),
};

// Mock Provider Wrappers
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';

// Just use the actual providers - they handle their own state
export const MockThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

export const MockUserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <UserProfileProvider>
    {children}
  </UserProfileProvider>
);

export const MockAccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AccessibilityProvider>
    {children}
  </AccessibilityProvider>
);
