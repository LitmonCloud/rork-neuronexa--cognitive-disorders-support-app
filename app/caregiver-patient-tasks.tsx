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
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  X,
  Calendar as CalendarIcon,
  GripVertical,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontSizes, fontWeights } from '@/theme/typography';
import { usePatients } from '@/contexts/PatientContext';
import { useTasks } from '@/contexts/TaskContext';
import { useNotifications } from '@/contexts/NotificationContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import CalendarView from '@/components/CalendarView';
import TimeWheelPicker from '@/components/TimeWheelPicker';
import { Task, TaskPriority } from '@/types/task';

export default function CaregiverPatientTasksScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const { selectedPatient, selectedDate, setSelectedDate, linkTaskToPatient, unlinkTaskFromPatient, updateTaskLink, getPatientTasks } = usePatients();
  const { allTasks, addTask, updateTask, deleteTask, addStep, editStep, deleteStep } = useTasks();
  const { addNotification } = useNotifications();

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

  const patientTaskLinks = useMemo(() => {
    if (!selectedPatient) return [];
    return getPatientTasks(selectedPatient.id);
  }, [selectedPatient, getPatientTasks]);

  const patientTasks = useMemo(() => {
    const taskIds = patientTaskLinks.map(pt => pt.taskId);
    return allTasks.filter(task => taskIds.includes(task.id));
  }, [allTasks, patientTaskLinks]);

  const tasksForSelectedDate = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return patientTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDateStr = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDateStr === dateStr;
    });
  }, [patientTasks, selectedDate]);

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
    headerTitleContainer: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      marginTop: 2,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: spacing.lg,
      gap: spacing.lg,
    },
    calendarCard: {
      padding: 0,
      overflow: 'hidden',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    sectionSubtitle: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
    },
    addButtonText: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      color: colors.surface,
    },
    taskCard: {
      padding: spacing.lg,
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
    taskActions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    iconButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.sm,
      backgroundColor: colors.border,
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
    modalActions: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    noStepsText: {
      fontSize: fontSizes.sm,
      color: colors.textLight,
      fontStyle: 'italic' as const,
      textAlign: 'center' as const,
      paddingVertical: spacing.md,
    },
  });

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

  const handleOpenTaskModal = (task?: Task) => {
    if (task) {
      setEditingTaskId(task.id);
      setTaskTitle(task.title);
      setTaskDescription(task.description || '');
      setTaskPriority(task.priority);
      setCompleteByTime(task.completeByTime || '');
    } else {
      setEditingTaskId(null);
      setTaskTitle('');
      setTaskDescription('');
      setTaskPriority('medium');
      setCompleteByTime('');
    }
    setShowTaskModal(true);
  };

  const handleSaveTask = async () => {
    if (!taskTitle.trim() || !selectedPatient) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (editingTaskId) {
      updateTask(editingTaskId, {
        title: taskTitle,
        description: taskDescription || undefined,
        priority: taskPriority,
        completeByTime: completeByTime || undefined,
      });

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

  const handleOpenStepModal = (task: Task, stepId?: string) => {
    setSelectedTask(task);
    if (stepId) {
      const step = task.steps.find(s => s.id === stepId);
      if (step) {
        setEditingStepId(stepId);
        setStepDescription(step.description);
        setStepSimplified(step.simplifiedText || '');
        setStepContext(step.contextualPrompt || '');
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
    if (!selectedTask || !stepDescription.trim()) {
      Alert.alert('Error', 'Please enter a step description');
      return;
    }

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

  if (!selectedPatient) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>No Patient Selected</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Please select a patient from the dashboard</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            {selectedPatient.firstName} {selectedPatient.lastNameInitial}.
          </Text>
          <Text style={styles.headerSubtitle}>Task Management</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.calendarCard}>
          <CalendarView
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            tasks={patientTasks}
          />
        </Card>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {tasksForSelectedDate.length} {tasksForSelectedDate.length === 1 ? 'task' : 'tasks'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleOpenTaskModal()}
            activeOpacity={0.7}
          >
            <Plus size={16} color={colors.surface} />
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {tasksForSelectedDate.length === 0 ? (
          <Card style={styles.emptyState}>
            <CalendarIcon size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>
              No tasks for this date. Add a task to get started.
            </Text>
          </Card>
        ) : (
          tasksForSelectedDate.map((task) => (
            <Card key={task.id} style={styles.taskCard}>
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
                    style={styles.addButton}
                    onPress={() => handleOpenStepModal(task)}
                    activeOpacity={0.7}
                  >
                    <Plus size={14} color={colors.surface} />
                    <Text style={styles.addButtonText}>Add Step</Text>
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
          ))
        )}
      </ScrollView>

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

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowTaskModal(false);
                  setEditingTaskId(null);
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
