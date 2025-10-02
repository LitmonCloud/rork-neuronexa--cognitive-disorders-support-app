import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskProvider, useTasks } from '@/contexts/TaskContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <TaskProvider>{children}</TaskProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
};

describe('TaskContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('should initialize with empty tasks', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tasks).toEqual([]);
  });

  it('should load tasks from AsyncStorage', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Test Task',
        status: 'pending',
        priority: 'medium',
        steps: [],
        createdAt: new Date().toISOString(),
        reminderEnabled: false,
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockTasks));

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    expect(result.current.tasks[0].title).toBe('Test Task');
  });

  it('should add a new task', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addTask('New Task', 'Description', 'high');
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    expect(result.current.tasks[0].title).toBe('New Task');
    expect(result.current.tasks[0].description).toBe('Description');
    expect(result.current.tasks[0].priority).toBe('high');
    expect(result.current.tasks[0].status).toBe('pending');
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('should update a task', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Test Task',
        status: 'pending',
        priority: 'medium',
        steps: [],
        createdAt: new Date().toISOString(),
        reminderEnabled: false,
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockTasks));

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    act(() => {
      result.current.updateTask('1', { title: 'Updated Task', priority: 'high' });
    });

    await waitFor(() => {
      expect(result.current.tasks[0].title).toBe('Updated Task');
    });

    expect(result.current.tasks[0].priority).toBe('high');
  });

  it('should delete a task', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Task 1',
        status: 'pending',
        priority: 'medium',
        steps: [],
        createdAt: new Date().toISOString(),
        reminderEnabled: false,
      },
      {
        id: '2',
        title: 'Task 2',
        status: 'pending',
        priority: 'low',
        steps: [],
        createdAt: new Date().toISOString(),
        reminderEnabled: false,
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockTasks));

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(2);
    });

    act(() => {
      result.current.deleteTask('1');
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    expect(result.current.tasks[0].id).toBe('2');
  });

  it('should complete a task', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Test Task',
        status: 'in-progress',
        priority: 'medium',
        steps: [],
        createdAt: new Date().toISOString(),
        reminderEnabled: false,
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockTasks));

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    act(() => {
      result.current.completeTask('1');
    });

    await waitFor(() => {
      expect(result.current.tasks[0].status).toBe('completed');
    });

    expect(result.current.tasks[0].completedAt).toBeTruthy();
  });

  it('should update step completion', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Test Task',
        status: 'in-progress',
        priority: 'medium',
        steps: [
          { id: 'step-1', description: 'Step 1', completed: false, order: 0 },
          { id: 'step-2', description: 'Step 2', completed: false, order: 1 },
        ],
        createdAt: new Date().toISOString(),
        reminderEnabled: false,
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockTasks));

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    act(() => {
      result.current.updateStep('1', 'step-1', true);
    });

    await waitFor(() => {
      expect(result.current.tasks[0].steps[0].completed).toBe(true);
    });

    expect(result.current.tasks[0].status).toBe('in-progress');
  });

  it('should complete task when all steps are completed', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Test Task',
        status: 'in-progress',
        priority: 'medium',
        steps: [
          { id: 'step-1', description: 'Step 1', completed: true, order: 0 },
          { id: 'step-2', description: 'Step 2', completed: false, order: 1 },
        ],
        createdAt: new Date().toISOString(),
        reminderEnabled: false,
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockTasks));

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    act(() => {
      result.current.updateStep('1', 'step-2', true);
    });

    await waitFor(() => {
      expect(result.current.tasks[0].status).toBe('completed');
    });

    expect(result.current.tasks[0].completedAt).toBeTruthy();
  });

  it('should filter tasks by status', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Pending Task',
        status: 'pending',
        priority: 'medium',
        steps: [],
        createdAt: new Date().toISOString(),
        reminderEnabled: false,
      },
      {
        id: '2',
        title: 'Completed Task',
        status: 'completed',
        priority: 'low',
        steps: [],
        createdAt: new Date().toISOString(),
        reminderEnabled: false,
        completedAt: new Date().toISOString(),
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockTasks));

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(2);
    });

    act(() => {
      result.current.setFilter('pending');
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    expect(result.current.tasks[0].status).toBe('pending');

    act(() => {
      result.current.setFilter('completed');
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    expect(result.current.tasks[0].status).toBe('completed');
  });
});
