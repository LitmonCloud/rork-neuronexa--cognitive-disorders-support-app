import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Plus,
  Users,
  Edit2,
  Trash2,
  X,
  ChevronRight,
  Phone,
  Calendar as CalendarIcon,
  GripVertical,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontSizes, fontWeights } from '@/theme/typography';
import { usePatients } from '@/contexts/PatientContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useTasks } from '@/contexts/TaskContext';
import { useNotifications } from '@/contexts/NotificationContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import PremiumGate from '@/components/PremiumGate';
import EnterCodeBar from '@/components/EnterCodeBar';
import AddPatientModal from '@/components/AddPatientModal';
import CalendarView from '@/components/CalendarView';
import TimeWheelPicker from '@/components/TimeWheelPicker';
import { Task, TaskPriority } from '@/types/task';

type TabType = 'patients' | 'tasks';

export default function CaregiverHubScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const { patients, updatePatient, deletePatient, selectPatient, selectedPatient, selectedDate, setSelectedDate, linkTaskToPatient, unlinkTaskFromPatient, updateTaskLink, patientTasks } = usePatients();
  const { allTasks, addTask, updateTask, deleteTask, addStep, editStep, deleteStep } = useTasks();
  const { addNotification } = useNotifications();

  const [activeTab, setActiveTab] = useState<TabType>('patients');
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastNameInitial, setLastNameInitial] = useState('');

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [completeByTime, setCompleteByTime] = useState('');

  const [stepDescription, setStepDescription] = useState('');
  const [stepSimplified, setStepSimplified] = useState('');
  const [stepContext, setStepContext] = useState('');
  const [tempSteps, setTempSteps] = useState<{id: string; description: string; simplifiedText?: string; contextualPrompt?: string}[]>([]);

  const allPatientTaskLinks = useMemo(() => patientTasks, [patientTasks]);

  const allPatientTasks = useMemo(() => {
    const taskIds = allPatientTaskLinks.map(pt => pt.taskId);
    return allTasks.filter(task => taskIds.includes(task.id)).map(task => {
      const link = allPatientTaskLinks.find(pt => pt.taskId === task.id);
      const patient = patients.find(p => p.id === link?.patientId);
      return {
        ...task,
        patientId: link?.patientId,
        patientName: patient ? `${patient.firstName} ${patient.lastNameInitial}.` : 'Unknown',
        patientColor: patient?.profileColor || colors.primary,
      };
    });
  }, [allTasks, allPatientTaskLinks, patients, colors.primary]);

  const tasksForSelectedDate = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return allPatientTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDateStr = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDateStr === dateStr;
    });
  }, [allPatientTasks, selectedDate]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingHorizontal: spacing.lg,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: colors.primary,
      fontWeight: fontWeights.bold,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: spacing.lg,
      gap: spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'column',
      gap: spacing.xs,
    },
    sectionTitle: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    sectionSubtitle: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    patientCard: {
      padding: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    patientAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    patientInitials: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.surface,
    },
    patientInfo: {
      flex: 1,
    },
    patientName: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    patientMeta: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
    },
    patientActions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    iconButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.sm,
      backgroundColor: colors.border,
    },
    emptyState: {
      alignItems: 'center',
      padding: spacing.xxxl,
    },
    emptyText: {
      fontSize: fontSizes.md,
      color: colors.textLight,
      marginTop: spacing.md,
      textAlign: 'center' as const,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    modalContent: {
      width: '100%',
      maxWidth: 500,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      gap: spacing.lg,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputLabel: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: fontSizes.md,
      color: colors.text,
    },
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top' as const,
    },
    modalActions: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    infoCard: {
      padding: spacing.lg,
      backgroundColor: colors.primaryLight + '15',
      borderColor: colors.primaryLight,
    },
    infoText: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    addButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.lg,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      minHeight: 56,
    },
    addButtonText: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.surface,
    },
    calendarCard: {
      padding: 0,
      overflow: 'hidden',
    },
    taskCard: {
      padding: spacing.lg,
      borderLeftWidth: 4,
    },
    taskHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    taskTitle: {
      flex: 1,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginRight: spacing.sm,
    },
    patientBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.sm,
      marginBottom: spacing.sm,
      alignSelf: 'flex-start',
    },
    patientBadgeText: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.semibold,
      color: colors.surface,
    },
    taskActions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    taskDescription: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },
    priorityBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.sm,
      marginBottom: spacing.md,
    },
    priorityText: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.semibold,
      textTransform: 'capitalize' as const,
    },
    statusBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.sm,
      marginBottom: spacing.sm,
    },
    statusText: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.semibold,
      textTransform: 'capitalize' as const,
    },
    stepsSection: {
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    stepsSectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    stepsTitle: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      color: colors.text,
    },
    stepItem: {
      flexDirection: 'row',
      gap: spacing.sm,
      padding: spacing.md,
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      marginBottom: spacing.sm,
    },
    stepGrip: {
      justifyContent: 'center',
    },
    stepContent: {
      flex: 1,
    },
    stepDescription: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    stepSimplified: {
      fontSize: fontSizes.xs,
      color: colors.textSecondary,
      fontStyle: 'italic' as const,
    },
    stepActions: {
      flexDirection: 'row',
      gap: spacing.xs,
    },
    noStepsText: {
      fontSize: fontSizes.sm,
      color: colors.textLight,
      fontStyle: 'italic' as const,
      textAlign: 'center' as const,
      paddingVertical: spacing.md,
    },
    prioritySelector: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    priorityOption: {
      flex: 1,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
    },
    priorityOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '20',
    },
    priorityOptionText: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: colors.textSecondary,
      textTransform: 'capitalize' as const,
    },
    priorityOptionTextActive: {
      color: colors.primary,
      fontWeight: fontWeights.bold,
    },
    modalStepsSection: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: spacing.lg,
      gap: spacing.md,
    },
    modalStepsSectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalStepsTitle: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      color: colors.text,
    },
    addStepButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: colors.primary + '20',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    addStepButtonText: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.semibold,
      color: colors.primary,
    },
    tempStepItem: {
      flexDirection: 'row',
      gap: spacing.sm,
      padding: spacing.sm,
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      alignItems: 'center',
    },
    tempStepText: {
      flex: 1,
      fontSize: fontSizes.sm,
      color: colors.text,
    },
    tempStepActions: {
      flexDirection: 'row',
      gap: spacing.xs,
    },
    smallIconButton: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.sm,
      backgroundColor: colors.border,
    },
    addTaskButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
    },
    addTaskButtonText: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      color: colors.surface,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
  });

  if (profileLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  if (profile?.role !== 'caregiver') {
    router.replace('/(tabs)');
    return null;
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return { backgroundColor: colors.success + '20' };
      case 'in-progress':
        return { backgroundColor: colors.warning + '20' };
      default:
        return { backgroundColor: colors.textLight + '20' };
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: colors.success };
      case 'in-progress':
        return { color: colors.warning };
      default:
        return { color: colors.textSecondary };
    }
  };

  const handleEditPatient = () => {
    if (!editingPatient || !firstName.trim() || !lastNameInitial.trim()) {
      Alert.alert('Error', 'Please enter both first name and last name initial');
      return;
    }

    if (lastNameInitial.length > 1) {
      Alert.alert('Error', 'Last name initial should be a single letter');
      return;
    }

    updatePatient(editingPatient, {
      firstName: firstName.trim(),
      lastNameInitial: lastNameInitial.trim().toUpperCase(),
    });
    setFirstName('');
    setLastNameInitial('');
    setEditingPatient(null);
    setShowEditPatientModal(false);
  };

  const handleDeletePatient = (patientId: string, patientName: string) => {
    Alert.alert(
      'Delete Patient',
      `Are you sure you want to remove ${patientName}? This will also delete all their tasks.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePatient(patientId),
        },
      ]
    );
  };

  const handleSelectPatient = (patientId: string) => {
    selectPatient(patientId);
    setActiveTab('tasks');
  };

  const openEditModal = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setEditingPatient(patientId);
      setFirstName(patient.firstName);
      setLastNameInitial(patient.lastNameInitial);
      setShowEditPatientModal(true);
    }
  };

  const handleOpenTaskModal = (task?: Task) => {
    if (task) {
      setEditingTaskId(task.id);
      setTaskTitle(task.title);
      setTaskDescription(task.description || '');
      setTaskPriority(task.priority);
      setCompleteByTime(task.completeByTime || '');
      setTempSteps(task.steps.map(s => ({
        id: s.id,
        description: s.description,
        simplifiedText: s.simplifiedText,
        contextualPrompt: s.contextualPrompt,
      })));
    } else {
      setEditingTaskId(null);
      setTaskTitle('');
      setTaskDescription('');
      setTaskPriority('medium');
      setCompleteByTime('');
      setTempSteps([]);
    }
    setShowTaskModal(true);
  };

  const handleSaveTask = async () => {
    if (!taskTitle.trim() || !selectedPatient) {
      Alert.alert('Error', 'Please enter a task title and select a patient');
      return;
    }

    if (editingTaskId) {
      updateTask(editingTaskId, {
        title: taskTitle,
        description: taskDescription || undefined,
        priority: taskPriority,
        completeByTime: completeByTime || undefined,
      });

      const task = allTasks.find(t => t.id === editingTaskId);
      if (task) {
        const existingStepIds = task.steps.map(s => s.id);
        const tempStepIds = tempSteps.map(s => s.id);
        
        existingStepIds.forEach(stepId => {
          if (!tempStepIds.includes(stepId)) {
            deleteStep(editingTaskId, stepId);
          }
        });
        
        tempSteps.forEach((step) => {
          const existingStep = task.steps.find(s => s.id === step.id);
          if (existingStep) {
            editStep(editingTaskId, step.id, {
              description: step.description,
              simplifiedText: step.simplifiedText,
              contextualPrompt: step.contextualPrompt,
            });
          } else {
            addStep(
              editingTaskId,
              step.description,
              step.simplifiedText,
              step.contextualPrompt
            );
          }
        });
      }

      updateTaskLink(editingTaskId, 'caregiver');

      addNotification({
        type: 'task_modified',
        title: 'Task Updated',
        message: `Task "${taskTitle}" was updated by caregiver`,
        priority: 'low',
        category: 'task',
        taskId: editingTaskId,
        taskTitle: taskTitle,
      });
    } else {
      const newTask = await addTask(
        taskTitle,
        taskDescription || undefined,
        taskPriority,
        selectedDate,
        completeByTime || undefined
      );

      tempSteps.forEach((step) => {
        addStep(
          newTask.id,
          step.description,
          step.simplifiedText,
          step.contextualPrompt
        );
      });

      linkTaskToPatient(selectedPatient.id, newTask.id, 'caregiver');

      addNotification({
        type: 'task_assigned',
        title: 'Task Assigned',
        message: `New task "${taskTitle}" assigned to ${selectedPatient.firstName} ${selectedPatient.lastNameInitial}. for ${selectedDate.toLocaleDateString()}`,
        priority: 'low',
        category: 'task',
        taskId: newTask.id,
        taskTitle: taskTitle,
      });
    }

    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setCompleteByTime('');
    setTempSteps([]);
    setEditingTaskId(null);
    setShowTaskModal(false);
  };

  const handleDeleteTask = (taskId: string, taskTitle: string) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${taskTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTask(taskId);
            unlinkTaskFromPatient(taskId);

            if (selectedPatient) {
              addNotification({
                type: 'task_deleted',
                title: 'Task Deleted',
                message: `Task "${taskTitle}" was removed from ${selectedPatient.firstName} ${selectedPatient.lastNameInitial}.'s schedule`,
                priority: 'low',
                category: 'task',
              });
            }
          },
        },
      ]
    );
  };

  const handleOpenStepModal = (task: Task | null, stepId?: string) => {
    setSelectedTask(task);
    if (stepId) {
      if (task) {
        const step = task.steps.find(s => s.id === stepId);
        if (step) {
          setEditingStepId(stepId);
          setStepDescription(step.description);
          setStepSimplified(step.simplifiedText || '');
          setStepContext(step.contextualPrompt || '');
        }
      }
    } else {
      setEditingStepId(null);
      setStepDescription('');
      setStepSimplified('');
      setStepContext('');
    }
    setShowStepModal(true);
  };

  const handleSaveStep = () => {
    if (!stepDescription.trim()) {
      Alert.alert('Error', 'Please enter a step description');
      return;
    }

    if (selectedTask) {
      if (editingStepId) {
        editStep(selectedTask.id, editingStepId, {
          description: stepDescription,
          simplifiedText: stepSimplified || undefined,
          contextualPrompt: stepContext || undefined,
        });
      } else {
        addStep(
          selectedTask.id,
          stepDescription,
          stepSimplified || undefined,
          stepContext || undefined
        );
      }

      updateTaskLink(selectedTask.id, 'caregiver');

      if (selectedPatient) {
        addNotification({
          type: 'task_modified',
          title: 'Task Updated',
          message: `Task "${selectedTask.title}" was updated by caregiver`,
          priority: 'low',
          category: 'task',
          taskId: selectedTask.id,
          taskTitle: selectedTask.title,
        });
      }
    } else {
      if (editingStepId) {
        setTempSteps(tempSteps.map(s => 
          s.id === editingStepId 
            ? { ...s, description: stepDescription, simplifiedText: stepSimplified || undefined, contextualPrompt: stepContext || undefined }
            : s
        ));
      } else {
        setTempSteps([...tempSteps, {
          id: Date.now().toString(),
          description: stepDescription,
          simplifiedText: stepSimplified || undefined,
          contextualPrompt: stepContext || undefined,
        }]);
      }
    }

    setStepDescription('');
    setStepSimplified('');
    setStepContext('');
    setEditingStepId(null);
    setShowStepModal(false);
  };

  const handleDeleteStep = (taskId: string, stepId: string) => {
    Alert.alert(
      'Delete Step',
      'Are you sure you want to delete this step?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteStep(taskId, stepId);
            updateTaskLink(taskId, 'caregiver');

            const task = allTasks.find(t => t.id === taskId);
            if (selectedPatient && task) {
              addNotification({
                type: 'task_modified',
                title: 'Task Updated',
                message: `A step was removed from "${task.title}"`,
                priority: 'low',
                category: 'task',
                taskId: task.id,
                taskTitle: task.title,
              });
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)');
            }
          }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Caregiver Hub</Text>
        <View style={{ width: 40 }} />
      </View>

      <EnterCodeBar />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'patients' && styles.tabActive]}
          onPress={() => setActiveTab('patients')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'patients' && styles.tabTextActive]}>
            Patients ({patients.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tasks' && styles.tabActive]}
          onPress={() => setActiveTab('tasks')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'tasks' && styles.tabTextActive]}>
            Tasks ({allPatientTasks.length})
          </Text>
        </TouchableOpacity>
      </View>

      <PremiumGate
        feature="Caregiver Hub"
        featureDescription="Manage multiple patients, create tasks, and monitor their progress in real-time."
      >
        {activeTab === 'patients' ? (
          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            <Card style={styles.infoCard}>
              <Text style={styles.infoText}>
                Manage your patients here. Select a patient to view and manage their tasks with a calendar view.
                All changes sync in real-time.
              </Text>
            </Card>

            <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg }}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddPatientModal(true)}
                activeOpacity={0.7}
                testID="add-patient-button"
              >
                <Plus size={20} color={colors.surface} />
                <Text style={styles.addButtonText}>Add Patient</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>My Patients</Text>
                <Text style={styles.sectionSubtitle}>
                  {patients.length} {patients.length === 1 ? 'patient' : 'patients'}
                </Text>
              </View>
            </View>

            {patients.length === 0 ? (
              <Card style={styles.emptyState}>
                <Users size={48} color={colors.textLight} />
                <Text style={styles.emptyText}>
                  No patients yet. Add your first patient to get started.
                </Text>
              </Card>
            ) : (
              patients.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  onPress={() => handleSelectPatient(patient.id)}
                  activeOpacity={0.7}
                >
                  <Card style={styles.patientCard}>
                    <View style={[styles.patientAvatar, { backgroundColor: patient.profileColor || colors.primary }]}>
                      <Text style={styles.patientInitials}>
                        {patient.firstName.charAt(0).toUpperCase()}{patient.lastNameInitial.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.patientInfo}>
                      <Text style={styles.patientName}>
                        {patient.firstName} {patient.lastNameInitial}.
                      </Text>
                      <Text style={styles.patientMeta}>
                        Added {new Date(patient.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.patientActions}>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          selectPatient(patient.id);
                          router.push('/emergency-contacts');
                        }}
                        activeOpacity={0.7}
                      >
                        <Phone size={16} color={colors.secondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          openEditModal(patient.id);
                        }}
                        activeOpacity={0.7}
                      >
                        <Edit2 size={16} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDeletePatient(patient.id, `${patient.firstName} ${patient.lastNameInitial}.`);
                        }}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={16} color={colors.error} />
                      </TouchableOpacity>
                      <View style={styles.iconButton}>
                        <ChevronRight size={16} color={colors.textSecondary} />
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        ) : (
          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            <Card style={styles.calendarCard}>
              <CalendarView
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                tasks={allPatientTasks}
              />
            </Card>

            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {tasksForSelectedDate.length} {tasksForSelectedDate.length === 1 ? 'task' : 'tasks'}
                </Text>
              </View>
              {selectedPatient && (
                <TouchableOpacity
                  style={styles.addTaskButton}
                  onPress={() => handleOpenTaskModal()}
                  activeOpacity={0.7}
                >
                  <Plus size={16} color={colors.surface} />
                  <Text style={styles.addTaskButtonText}>Add Task</Text>
                </TouchableOpacity>
              )}
            </View>

            {!selectedPatient && (
              <Card style={styles.infoCard}>
                <Text style={styles.infoText}>
                  Select a patient from the Patients tab to view and manage their tasks.
                </Text>
              </Card>
            )}

            {selectedPatient && tasksForSelectedDate.length === 0 && (
              <Card style={styles.emptyState}>
                <CalendarIcon size={48} color={colors.textLight} />
                <Text style={styles.emptyText}>
                  No tasks for this date.
                </Text>
              </Card>
            )}

            {tasksForSelectedDate.map((task) => (
              <Card key={task.id} style={[styles.taskCard, { borderLeftColor: task.patientColor }]}>
                <View style={[styles.patientBadge, { backgroundColor: task.patientColor }]}>
                  <Text style={styles.patientBadgeText}>{task.patientName}</Text>
                </View>
                
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <View style={styles.taskActions}>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleOpenTaskModal(task)}
                      activeOpacity={0.7}
                    >
                      <Edit2 size={16} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleDeleteTask(task.id, task.title)}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>

                {task.description && (
                  <Text style={styles.taskDescription}>{task.description}</Text>
                )}

                <View style={[styles.statusBadge, getStatusStyle(task.status)]}>
                  <Text style={[styles.statusText, getStatusTextStyle(task.status)]}>
                    {task.status}
                  </Text>
                </View>

                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                    {task.priority} priority
                  </Text>
                </View>

                {task.completeByTime && (
                  <View style={[styles.priorityBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.priorityText, { color: colors.primary }]}>
                      Complete by {task.completeByTime}
                    </Text>
                  </View>
                )}

                <View style={styles.stepsSection}>
                  <View style={styles.stepsSectionHeader}>
                    <Text style={styles.stepsTitle}>
                      Steps ({task.steps.length})
                    </Text>
                    <TouchableOpacity
                      style={styles.addTaskButton}
                      onPress={() => handleOpenStepModal(task)}
                      activeOpacity={0.7}
                    >
                      <Plus size={14} color={colors.surface} />
                      <Text style={styles.addTaskButtonText}>Add Step</Text>
                    </TouchableOpacity>
                  </View>

                  {task.steps.length === 0 ? (
                    <Text style={styles.noStepsText}>
                      No steps yet. Add steps to guide the patient.
                    </Text>
                  ) : (
                    task.steps
                      .sort((a, b) => a.order - b.order)
                      .map((step, index) => (
                        <View key={step.id} style={styles.stepItem}>
                          <View style={styles.stepGrip}>
                            <GripVertical size={16} color={colors.textLight} />
                          </View>
                          <View style={styles.stepContent}>
                            <Text style={styles.stepDescription}>
                              {index + 1}. {step.description}
                            </Text>
                            {step.simplifiedText && (
                              <Text style={styles.stepSimplified}>
                                Simple: {step.simplifiedText}
                              </Text>
                            )}
                          </View>
                          <View style={styles.stepActions}>
                            <TouchableOpacity
                              style={styles.iconButton}
                              onPress={() => handleOpenStepModal(task, step.id)}
                              activeOpacity={0.7}
                            >
                              <Edit2 size={14} color={colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.iconButton}
                              onPress={() => handleDeleteStep(task.id, step.id)}
                              activeOpacity={0.7}
                            >
                              <Trash2 size={14} color={colors.error} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                  )}
                </View>
              </Card>
            ))}
          </ScrollView>
        )}
      </PremiumGate>

      <AddPatientModal
        visible={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        defaultMethod="code"
      />

      <Modal
        visible={showEditPatientModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditPatientModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Patient</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowEditPatientModal(false)}
                activeOpacity={0.7}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View>
              <Text style={styles.inputLabel}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="e.g., John"
                placeholderTextColor={colors.textLight}
                autoCapitalize="words"
              />
            </View>

            <View>
              <Text style={styles.inputLabel}>Last Name Initial *</Text>
              <TextInput
                style={styles.input}
                value={lastNameInitial}
                onChangeText={(text) => setLastNameInitial(text.slice(0, 1))}
                placeholder="e.g., D"
                placeholderTextColor={colors.textLight}
                maxLength={1}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setShowEditPatientModal(false)}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <Button
                title="Save Changes"
                onPress={handleEditPatient}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showTaskModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTaskModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingTaskId ? 'Edit Task' : 'Create Task'}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowTaskModal(false);
                  setEditingTaskId(null);
                }}
                activeOpacity={0.7}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View>
              <Text style={styles.inputLabel}>Task Title *</Text>
              <TextInput
                style={styles.input}
                value={taskTitle}
                onChangeText={setTaskTitle}
                placeholder="e.g., Make breakfast"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View>
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={taskDescription}
                onChangeText={setTaskDescription}
                placeholder="Add more details..."
                placeholderTextColor={colors.textLight}
                multiline
              />
            </View>

            <View>
              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.prioritySelector}>
                {(['low', 'medium', 'high'] as TaskPriority[]).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      taskPriority === priority && styles.priorityOptionActive,
                    ]}
                    onPress={() => setTaskPriority(priority)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.priorityOptionText,
                        taskPriority === priority && styles.priorityOptionTextActive,
                      ]}
                    >
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.inputLabel}>Complete By Time (Optional)</Text>
              <TimeWheelPicker
                value={completeByTime}
                onChange={setCompleteByTime}
              />
            </View>

            <View style={styles.modalStepsSection}>
              <View style={styles.modalStepsSectionHeader}>
                <Text style={styles.modalStepsTitle}>Steps ({tempSteps.length})</Text>
                <TouchableOpacity
                  style={styles.addStepButton}
                  onPress={() => handleOpenStepModal(null)}
                  activeOpacity={0.7}
                >
                  <Plus size={12} color={colors.primary} />
                  <Text style={styles.addStepButtonText}>Add Step</Text>
                </TouchableOpacity>
              </View>
              {tempSteps.length === 0 ? (
                <Text style={styles.noStepsText}>No steps yet. Add steps to guide the patient.</Text>
              ) : (
                tempSteps.map((step, index) => (
                  <View key={step.id} style={styles.tempStepItem}>
                    <Text style={styles.tempStepText}>
                      {index + 1}. {step.description}
                    </Text>
                    <View style={styles.tempStepActions}>
                      <TouchableOpacity
                        style={styles.smallIconButton}
                        onPress={() => {
                          setStepDescription(step.description);
                          setStepSimplified(step.simplifiedText || '');
                          setStepContext(step.contextualPrompt || '');
                          setEditingStepId(step.id);
                          setShowStepModal(true);
                        }}
                        activeOpacity={0.7}
                      >
                        <Edit2 size={12} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.smallIconButton}
                        onPress={() => {
                          setTempSteps(tempSteps.filter(s => s.id !== step.id));
                        }}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={12} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowTaskModal(false);
                  setEditingTaskId(null);
                  setTempSteps([]);
                }}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <Button
                title={editingTaskId ? 'Save Changes' : 'Create Task'}
                onPress={handleSaveTask}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showStepModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStepModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing.lg }}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingStepId ? 'Edit Step' : 'Add New Step'}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowStepModal(false)}
                  activeOpacity={0.7}
                >
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View>
                <Text style={styles.inputLabel}>Step Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={stepDescription}
                  onChangeText={setStepDescription}
                  placeholder="e.g., Get a bowl from the cupboard"
                  placeholderTextColor={colors.textLight}
                  multiline
                />
              </View>

              <View>
                <Text style={styles.inputLabel}>Simplified Text (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={stepSimplified}
                  onChangeText={setStepSimplified}
                  placeholder="e.g., Get bowl"
                  placeholderTextColor={colors.textLight}
                  multiline
                />
              </View>

              <View>
                <Text style={styles.inputLabel}>Context/Why This Matters (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={stepContext}
                  onChangeText={setStepContext}
                  placeholder="e.g., Having the right bowl makes it easier"
                  placeholderTextColor={colors.textLight}
                  multiline
                />
              </View>

              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  onPress={() => setShowStepModal(false)}
                  variant="secondary"
                  style={{ flex: 1 }}
                />
                <Button
                  title={editingStepId ? 'Save Changes' : 'Add Step'}
                  onPress={handleSaveStep}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
