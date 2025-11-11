import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import { Task, TaskPriority, TaskStatus, TaskStep } from '@/types/task';
import { generateText } from '@rork-ai/toolkit-sdk';

const TASKS_STORAGE_KEY = '@nexa_tasks';

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
    priority: TaskPriority = 'medium',
    scheduledDate?: Date,
    completeByTime?: string
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      status: 'pending',
      steps: [],
      createdAt: new Date().toISOString(),
      dueDate: scheduledDate ? scheduledDate.toISOString() : undefined,
      completeByTime,
      reminderEnabled: false,
    };

    const updatedTasks = [...tasks, newTask];
    await mutateTasksAsync(updatedTasks);
    console.log('[TaskContext] Task saved to storage:', newTask.id);
    if (scheduledDate) {
      console.log('[TaskContext] Task scheduled for:', scheduledDate.toISOString());
    }

    return newTask;
  }, [tasks, mutateTasksAsync]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    mutateTasks(updatedTasks);
  }, [tasks, mutateTasks]);

  const deleteTask = useCallback((taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    mutateTasks(updatedTasks);
  }, [tasks, mutateTasks]);

  const completeTask = useCallback((taskId: string) => {
    console.log('[TaskContext] completeTask called for:', taskId);
    const task = tasks.find(t => t.id === taskId);
    console.log('[TaskContext] Found task:', task ? task.title : 'NOT FOUND');
    console.log('[TaskContext] Task status:', task?.status);
    if (task && task.status !== 'completed') {
      console.log('[TaskContext] Updating task to completed');
      const updatedTasks = tasks.map(t =>
        t.id === taskId
          ? { ...t, status: 'completed' as TaskStatus, completedAt: new Date().toISOString() }
          : t
      );
      mutateTasks(updatedTasks);
      console.log('[TaskContext] Task updated, mutation called');
    } else {
      console.log('[TaskContext] Task not updated - either not found or already completed');
    }
  }, [tasks, mutateTasks]);

  const updateStep = useCallback((taskId: string, stepId: string, completed: boolean) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSteps = task.steps.map(step =>
          step.id === stepId ? { ...step, completed } : step
        );
        const allStepsCompleted = updatedSteps.every(s => s.completed);
        return {
          ...task,
          steps: updatedSteps,
          status: allStepsCompleted && updatedSteps.length > 0 
            ? 'completed' as TaskStatus 
            : (task.status === 'completed' ? 'in-progress' as TaskStatus : task.status),
          completedAt: allStepsCompleted && updatedSteps.length > 0 ? new Date().toISOString() : task.completedAt,
        };
      }
      return task;
    });
    mutateTasks(updatedTasks);
  }, [tasks, mutateTasks]);

  const addStep = useCallback((taskId: string, description: string, simplifiedText?: string, contextualPrompt?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStep: TaskStep = {
      id: `${taskId}-step-${Date.now()}`,
      description,
      simplifiedText,
      contextualPrompt,
      completed: false,
      order: task.steps.length,
    };

    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, steps: [...t.steps, newStep] } : t
    );
    mutateTasks(updatedTasks);
  }, [tasks, mutateTasks]);

  const editStep = useCallback((taskId: string, stepId: string, updates: Partial<TaskStep>) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSteps = task.steps.map(step =>
          step.id === stepId ? { ...step, ...updates } : step
        );
        return { ...task, steps: updatedSteps };
      }
      return task;
    });
    mutateTasks(updatedTasks);
  }, [tasks, mutateTasks]);

  const deleteStep = useCallback((taskId: string, stepId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSteps = task.steps
          .filter(step => step.id !== stepId)
          .map((step, index) => ({ ...step, order: index }));
        return { ...task, steps: updatedSteps };
      }
      return task;
    });
    mutateTasks(updatedTasks);
  }, [tasks, mutateTasks]);

  const reorderSteps = useCallback((taskId: string, stepIds: string[]) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const reorderedSteps = stepIds
          .map(id => task.steps.find(s => s.id === id))
          .filter((s): s is TaskStep => s !== undefined)
          .map((step, index) => ({ ...step, order: index }));
        return { ...task, steps: reorderedSteps };
      }
      return task;
    });
    mutateTasks(updatedTasks);
  }, [tasks, mutateTasks]);

  const breakdownTask = useCallback(async (taskId: string, cognitiveLevel: 'simple' | 'moderate' | 'complex' = 'moderate') => {
    await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const currentTasks = queryClient.getQueryData<Task[]>(['tasks']) || [];
    console.log('[TaskContext] Looking for task:', taskId);
    console.log('[TaskContext] Available tasks:', currentTasks.map(t => ({ id: t.id, title: t.title })));
    
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
      let response: string;
      try {
        const rawResponse = await generateText(prompt);
        console.log('[TaskContext] AI response received, type:', typeof rawResponse);
        console.log('[TaskContext] AI response length:', String(rawResponse).length);
        console.log('[TaskContext] AI response preview:', String(rawResponse).substring(0, 300));
        
        response = String(rawResponse).trim();
        
        if (response.startsWith('```json')) {
          response = response.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
        } else if (response.startsWith('```')) {
          response = response.replace(/^```[a-z]*\s*/, '').replace(/```\s*$/, '').trim();
        }
        
        console.log('[TaskContext] Cleaned response preview:', response.substring(0, 300));
      } catch (aiError) {
        console.error('[TaskContext] AI call failed:', aiError);
        console.error('[TaskContext] Error details:', aiError instanceof Error ? aiError.message : String(aiError));
        throw new Error('AI service unavailable');
      }
      
      if (!response || typeof response !== 'string') {
        console.error('[TaskContext] Invalid AI response type:', typeof response);
        throw new Error('Invalid AI response');
      }
      
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
        console.error('[TaskContext] Raw response:', response);
        throw new Error('Failed to generate steps from AI response');
      }

      const currentTasks = queryClient.getQueryData<Task[]>(['tasks']) || [];
      const updatedTasks = currentTasks.map(t =>
        t.id === taskId ? { ...t, steps, status: 'in-progress' as TaskStatus, cognitiveLevel } : t
      );
      await mutateTasksAsync(updatedTasks);
      console.log('[TaskContext] Task updated with steps');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[TaskContext] Error breaking down task:', errorMessage);
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
    addStep,
    editStep,
    deleteStep,
    reorderSteps,
  }), [filteredTasks, tasks, tasksQuery.isLoading, filter, addTask, updateTask, deleteTask, completeTask, updateStep, breakdownTask, addStep, editStep, deleteStep, reorderSteps]);
});
