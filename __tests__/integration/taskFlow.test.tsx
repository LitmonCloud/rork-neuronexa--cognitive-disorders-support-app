import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskProvider, useTasks } from '@/contexts/TaskContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { aiService } from '@/services/ai/AIService';

jest.mock('@/services/ai/AIService');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <TaskProvider>{children}</TaskProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};



describe('Task Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (aiService.generateTaskBreakdown as jest.Mock).mockResolvedValue({
      steps: [
        { id: '1', description: 'Step 1', simplifiedText: 'Do step 1', estimatedTime: 5, order: 0 },
        { id: '2', description: 'Step 2', simplifiedText: 'Do step 2', estimatedTime: 10, order: 1 },
      ],
      supportiveMessage: 'You can do this!',
      adaptations: [],
    });
  });

  it('should complete full task lifecycle', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addTask('Complete project', 'Finish the work', 'high');
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.updateTask(taskId, { status: 'in-progress' });
    });

    await waitFor(() => {
      expect(result.current.tasks[0].status).toBe('in-progress');
    });

    const steps = result.current.tasks[0].steps;
    
    act(() => {
      result.current.updateStep(taskId, steps[0].id, true);
    });

    await waitFor(() => {
      expect(result.current.tasks[0].steps[0].completed).toBe(true);
    });

    act(() => {
      result.current.updateStep(taskId, steps[1].id, true);
    });

    await waitFor(() => {
      expect(result.current.tasks[0].status).toBe('completed');
    });

    expect(result.current.tasks[0].completedAt).toBeTruthy();
  });

  it('should handle task deletion', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addTask('Test task', 'Description', 'medium');
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.updateTask(taskId, { status: 'in-progress' });
    });

    await waitFor(() => {
      expect(result.current.tasks[0].status).toBe('in-progress');
    });

    act(() => {
      result.current.deleteTask(taskId);
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(0);
    });
  });

  it('should persist tasks across sessions', async () => {
    const { result: result1 } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result1.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result1.current.addTask('Persistent task', 'Should persist', 'low');
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(savedData);

    const { result: result2 } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result2.current.tasks).toHaveLength(1);
    });

    expect(result2.current.tasks[0].title).toBe('Persistent task');
  });

  it('should generate AI breakdown for tasks', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addTask('AI task', 'Generate breakdown', 'high');
    });

    const taskId = result.current.tasks[0].id;

    await act(async () => {
      await result.current.breakdownTask(taskId, 'moderate');
    });

    await waitFor(() => {
      expect(result.current.tasks[0].steps.length).toBeGreaterThan(0);
    });
  });
});
