import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { generateText } from '@rork/toolkit-sdk';
import { useNotifications } from './NotificationContext';

const TASKS_STORAGE_KEY = '@neuronexa_tasks';

async function loadTasks(): Promise<Task[]> {
  try {
    const stored = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}

async function saveTasks(tasks: Task[]): Promise<Task[]> {
  try {
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return tasks;
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw error;
  }
}

export const [TaskProvider, useTasks] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const { addNotification } = useNotifications();

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: loadTasks,
  });

  const saveMutation = useMutation({
    mutationFn: saveTasks,
    onSuccess: (data) => {
      queryClient.setQueryData(['tasks'], data);
    },
  });

  const { mutate: mutateTasks, mutateAsync: mutateTasksAsync } = saveMutation;
  const tasks = useMemo(() => tasksQuery.data || [], [tasksQuery.data]);

  const addTask = useCallback(async (
    title: string,
    description?: string,
    priority: TaskPriority = 'medium'
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      status: 'pending',
      steps: [],
      createdAt: new Date().toISOString(),
      reminderEnabled: false,
    };

    const updatedTasks = [...tasks, newTask];
    await mutateTasksAsync(updatedTasks);

    addNotification({
      type: 'task_created',
      title: 'New Task Created',
      message: `"${title}" has been added`,
      taskId: newTask.id,
      taskTitle: title,
      priority: priority === 'high' ? 'high' : 'low',
      category: 'task',
    });

    return newTask;
  }, [tasks, mutateTasksAsync, addNotification]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    const task = tasks.find(t => t.id === taskId);
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    mutateTasks(updatedTasks);

    if (task && updates.status && updates.status !== task.status) {
      if (updates.status === 'in-progress') {
        addNotification({
          type: 'task_started',
          title: 'Task Started',
          message: `"${task.title}" is now in progress`,
          taskId: task.id,
          taskTitle: task.title,
          priority: 'low',
          category: 'task',
        });
      }
    }
  }, [tasks, mutateTasks, addNotification]);

  const deleteTask = useCallback((taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    mutateTasks(updatedTasks);
  }, [tasks, mutateTasks]);

  const completeTask = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== 'completed') {
      const updatedTasks = tasks.map(t =>
        t.id === taskId
          ? { ...t, status: 'completed' as TaskStatus, completedAt: new Date().toISOString() }
          : t
      );
      mutateTasks(updatedTasks);

      addNotification({
        type: 'task_completed',
        title: 'Task Completed! 🎉',
        message: `"${task.title}" has been completed`,
        taskId: task.id,
        taskTitle: task.title,
        priority: 'low',
        category: 'task',
        metadata: { priority: task.priority },
      });
    }
  }, [tasks, mutateTasks, addNotification]);

  const updateStep = useCallback((taskId: string, stepId: string, completed: boolean) => {
    const task = tasks.find(t => t.id === taskId);
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSteps = task.steps.map(step =>
          step.id === stepId ? { ...step, completed } : step
        );
        const allStepsCompleted = updatedSteps.every(s => s.completed);
        return {
          ...task,
          steps: updatedSteps,
          status: allStepsCompleted && updatedSteps.length > 0 ? 'completed' as TaskStatus : task.status,
          completedAt: allStepsCompleted && updatedSteps.length > 0 ? new Date().toISOString() : task.completedAt,
        };
      }
      return task;
    });
    mutateTasks(updatedTasks);

    if (task && completed) {
      const completedSteps = task.steps.filter(s => s.completed || s.id === stepId).length;
      const totalSteps = task.steps.length;

      if (completedSteps === totalSteps) {
        addNotification({
          type: 'all_steps_completed',
          title: 'All Steps Completed! 🎉',
          message: `All steps for "${task.title}" are done`,
          taskId: task.id,
          taskTitle: task.title,
          priority: 'low',
          category: 'task',
          metadata: { completedSteps, totalSteps },
        });
      } else {
        addNotification({
          type: 'step_completed',
          title: 'Step Completed',
          message: `Progress on "${task.title}": ${completedSteps}/${totalSteps} steps`,
          taskId: task.id,
          taskTitle: task.title,
          priority: 'low',
          category: 'task',
          metadata: { completedSteps, totalSteps },
        });
      }
    }
  }, [tasks, mutateTasks, addNotification]);

  const breakdownTask = useCallback(async (taskId: string, cognitiveLevel: 'simple' | 'moderate' | 'complex' = 'moderate') => {
    const currentTasks = queryClient.getQueryData<Task[]>(['tasks']) || [];
    const task = currentTasks.find(t => t.id === taskId);
    if (!task) {
      console.error('[TaskContext] Task not found for breakdown:', taskId);
      console.error('[TaskContext] Available task IDs:', currentTasks.map(t => t.id));
      return;
    }

    console.log('[TaskContext] Starting breakdown for task:', taskId, task.title);

    if (!process.env.EXPO_PUBLIC_TOOLKIT_URL) {
      console.error('[TaskContext] EXPO_PUBLIC_TOOLKIT_URL is not set. AI features require this environment variable.');
      console.error('[TaskContext] Using fallback steps instead.');
      const fallbackSteps = [
        {
          id: `${taskId}-step-0`,
          description: 'Start by gathering what you need',
          simplifiedText: 'Get your things ready',
          contextualPrompt: 'Having everything ready makes the task easier',
          completed: false,
          order: 0,
        },
        {
          id: `${taskId}-step-1`,
          description: 'Take the first small action',
          simplifiedText: 'Do the first step',
          contextualPrompt: 'Starting is often the hardest part - you\'ve got this!',
          completed: false,
          order: 1,
        },
        {
          id: `${taskId}-step-2`,
          description: 'Continue at your own pace',
          simplifiedText: 'Keep going slowly',
          contextualPrompt: 'There\'s no rush - take breaks when you need them',
          completed: false,
          order: 2,
        },
      ];
      const updatedTasks = currentTasks.map(t =>
        t.id === taskId ? { ...t, steps: fallbackSteps, status: 'in-progress' as TaskStatus, cognitiveLevel } : t
      );
      await mutateTasksAsync(updatedTasks);
      return;
    }

    try {
      const complexityGuide = {
        simple: 'Use very simple language (5th grade level). Break into 3-4 tiny steps. Each step should be one clear action.',
        moderate: 'Use clear, straightforward language. Break into 4-5 manageable steps.',
        complex: 'Use detailed instructions. Break into 5-7 comprehensive steps.',
      };

      const prompt = `You are helping someone with cognitive disabilities complete a task. ${complexityGuide[cognitiveLevel]}

Task: ${task.title}
${task.description ? `Description: ${task.description}` : ''}

For each step, provide:
1. A clear description
2. A simplified version (even simpler language)
3. A contextual prompt (why this step matters)

Format each step as:
STEP: [description]
SIMPLE: [simplified version]
CONTEXT: [why this matters]
---`;

      console.log('[TaskContext] Calling AI with prompt length:', prompt.length);
      const response = await generateText(prompt);
      console.log('[TaskContext] AI response received, length:', response.length);
      
      const stepBlocks = response.split('---').filter(block => block.trim());
      console.log('[TaskContext] Parsed step blocks:', stepBlocks.length);
      
      const steps = stepBlocks.map((block, index) => {
        const lines = block.split('\n').filter(l => l.trim());
        const description = lines.find(l => l.startsWith('STEP:'))?.replace('STEP:', '').trim() || '';
        const simplifiedText = lines.find(l => l.startsWith('SIMPLE:'))?.replace('SIMPLE:', '').trim();
        const contextualPrompt = lines.find(l => l.startsWith('CONTEXT:'))?.replace('CONTEXT:', '').trim();
        
        return {
          id: `${taskId}-step-${index}`,
          description,
          simplifiedText,
          contextualPrompt,
          completed: false,
          order: index,
        };
      }).filter(step => step.description);

      console.log('[TaskContext] Generated steps:', steps.length);

      if (steps.length === 0) {
        console.error('[TaskContext] No steps generated from AI response');
        throw new Error('Failed to generate steps from AI response');
      }

      const currentTasks = queryClient.getQueryData<Task[]>(['tasks']) || [];
      const updatedTasks = currentTasks.map(t =>
        t.id === taskId ? { ...t, steps, status: 'in-progress' as TaskStatus, cognitiveLevel } : t
      );
      await mutateTasksAsync(updatedTasks);
      console.log('[TaskContext] Task updated with steps');
    } catch (error) {
      console.error('[TaskContext] Error breaking down task:', error);
      console.log('[TaskContext] Using fallback steps due to error');
      
      const fallbackSteps = [
        {
          id: `${taskId}-step-0`,
          description: 'Start by gathering what you need',
          simplifiedText: 'Get your things ready',
          contextualPrompt: 'Having everything ready makes the task easier',
          completed: false,
          order: 0,
        },
        {
          id: `${taskId}-step-1`,
          description: 'Take the first small action',
          simplifiedText: 'Do the first step',
          contextualPrompt: 'Starting is often the hardest part - you\'ve got this!',
          completed: false,
          order: 1,
        },
        {
          id: `${taskId}-step-2`,
          description: 'Continue at your own pace',
          simplifiedText: 'Keep going slowly',
          contextualPrompt: 'There\'s no rush - take breaks when you need them',
          completed: false,
          order: 2,
        },
        {
          id: `${taskId}-step-3`,
          description: 'Finish and celebrate your success',
          simplifiedText: 'Complete and feel proud',
          contextualPrompt: 'You did it! Every accomplishment matters.',
          completed: false,
          order: 3,
        },
      ];
      
      const currentTasks = queryClient.getQueryData<Task[]>(['tasks']) || [];
      const updatedTasks = currentTasks.map(t =>
        t.id === taskId ? { ...t, steps: fallbackSteps, status: 'in-progress' as TaskStatus, cognitiveLevel } : t
      );
      await mutateTasksAsync(updatedTasks);
    }
  }, [queryClient, mutateTasksAsync]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filter === 'all') return true;
      return task.status === filter;
    });
  }, [tasks, filter]);

  return useMemo(() => ({
    tasks: filteredTasks,
    allTasks: tasks,
    isLoading: tasksQuery.isLoading,
    filter,
    setFilter,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    updateStep,
    breakdownTask,
  }), [filteredTasks, tasks, tasksQuery.isLoading, filter, addTask, updateTask, deleteTask, completeTask, updateStep, breakdownTask]);
});
