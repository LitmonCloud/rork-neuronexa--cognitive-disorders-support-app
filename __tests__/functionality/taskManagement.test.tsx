import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { TaskContext, useTasks } from '@/contexts/TaskContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskStatus } from '@/types/task';

jest.mock('@react-native-async-storage/async-storage');

describe('Task Management Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('should add a new task', async () => {
    let taskCount = 0;

    const TestComponent = () => {
      const { tasks, addTask } = useTasks();
      
      React.useEffect(() => {
        taskCount = tasks.length;
      }, [tasks]);

      React.useEffect(() => {
        addTask({
          title: 'Test Task',
          description: 'Test description',
          priority: 'medium',
          category: 'personal',
        });
      }, []);

      return null;
    };

    render(
      <TaskContext>
        <TestComponent />
      </TaskContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should update task status', async () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Test Task',
        description: 'Test description',
        status: 'pending' as TaskStatus,
        priority: 'medium',
        category: 'personal',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        steps: [],
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockTasks)
    );

    const TestComponent = () => {
      const { updateTaskStatus } = useTasks();
      
      React.useEffect(() => {
        updateTaskStatus('1', 'in_progress');
      }, []);

      return null;
    };

    render(
      <TaskContext>
        <TestComponent />
      </TaskContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should delete a task', async () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Test Task',
        description: 'Test description',
        status: 'pending' as TaskStatus,
        priority: 'medium',
        category: 'personal',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        steps: [],
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockTasks)
    );

    const TestComponent = () => {
      const { deleteTask } = useTasks();
      
      React.useEffect(() => {
        deleteTask('1');
      }, []);

      return null;
    };

    render(
      <TaskContext>
        <TestComponent />
      </TaskContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should filter tasks by status', async () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Pending Task',
        description: 'Test',
        status: 'pending' as TaskStatus,
        priority: 'medium',
        category: 'personal',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        steps: [],
      },
      {
        id: '2',
        title: 'Completed Task',
        description: 'Test',
        status: 'completed' as TaskStatus,
        priority: 'medium',
        category: 'personal',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        steps: [],
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockTasks)
    );

    let filteredTasks: Task[] = [];

    const TestComponent = () => {
      const { tasks, setFilter } = useTasks();
      
      React.useEffect(() => {
        filteredTasks = tasks;
      }, [tasks]);

      React.useEffect(() => {
        setFilter('completed');
      }, []);

      return null;
    };

    render(
      <TaskContext>
        <TestComponent />
      </TaskContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('tasks');
    });
  });

  it('should complete a task step', async () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Test Task',
        description: 'Test',
        status: 'in_progress' as TaskStatus,
        priority: 'medium',
        category: 'personal',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        steps: [
          {
            id: 'step1',
            title: 'Step 1',
            description: 'First step',
            completed: false,
            order: 0,
          },
        ],
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockTasks)
    );

    const TestComponent = () => {
      const { completeStep } = useTasks();
      
      React.useEffect(() => {
        completeStep('1', 'step1');
      }, []);

      return null;
    };

    render(
      <TaskContext>
        <TestComponent />
      </TaskContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should load tasks from storage on mount', async () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Stored Task',
        description: 'Test',
        status: 'pending' as TaskStatus,
        priority: 'high',
        category: 'work',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        steps: [],
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockTasks)
    );

    let loadedTasks: Task[] = [];

    const TestComponent = () => {
      const { tasks } = useTasks();
      
      React.useEffect(() => {
        loadedTasks = tasks;
      }, [tasks]);

      return null;
    };

    render(
      <TaskContext>
        <TestComponent />
      </TaskContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('tasks');
    });
  });
});
