import React, { useState } from 'react';
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
  GripVertical,
  CheckCircle2,
  Calendar as CalendarIcon,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontSizes, fontWeights } from '@/theme/typography';
import { useTasks } from '@/contexts/TaskContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import PremiumGate from '@/components/PremiumGate';
import { Task, TaskPriority } from '@/types/task';

export default function CaregiverTaskManagerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const { allTasks, addTask, deleteTask, addStep, editStep, deleteStep } = useTasks();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskScheduledDate, setTaskScheduledDate] = useState<Date | null>(null);

  const [stepDescription, setStepDescription] = useState('');
  const [stepSimplified, setStepSimplified] = useState('');
  const [stepContext, setStepContext] = useState('');

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
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: spacing.lg,
      gap: spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
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
      fontSize: fontSizes.lg,
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
      fontSize: fontSizes.md,
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
    noStepsText: {
      fontSize: fontSizes.sm,
      color: colors.textLight,
      fontStyle: 'italic' as const,
      textAlign: 'center' as const,
      paddingVertical: spacing.md,
    },
    datePickerContainer: {
      marginBottom: spacing.md,
    },
    datePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    datePickerButtonActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    datePickerText: {
      fontSize: fontSizes.sm,
      color: colors.text,
      fontWeight: fontWeights.medium,
    },
    datePickerTextPlaceholder: {
      color: colors.textLight,
    },
    clearDateButton: {
      padding: spacing.xs,
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

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    await addTask(
      taskTitle, 
      taskDescription || undefined, 
      taskPriority,
      taskScheduledDate || undefined
    );
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setTaskScheduledDate(null);
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
          onPress: () => deleteTask(taskId),
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
          onPress: () => deleteStep(taskId, stepId),
        },
      ]
    );
  };

  return (
    <PremiumGate
      feature="Task Management"
      featureDescription="Create and manage tasks for your patient with custom steps and detailed instructions."
    >
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
          <Text style={styles.headerTitle}>Manage Tasks</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Card style={styles.infoCard}>
            <Text style={styles.infoText}>
              As a caregiver, you can create tasks for your patient and customize each step to match their needs. 
              Add detailed instructions, simplified text, and helpful context for each step.
            </Text>
          </Card>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Patient Tasks</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowTaskModal(true)}
              activeOpacity={0.7}
            >
              <Plus size={16} color={colors.surface} />
              <Text style={styles.addButtonText}>New Task</Text>
            </TouchableOpacity>
          </View>

          {allTasks.length === 0 ? (
            <Card style={styles.emptyState}>
              <CheckCircle2 size={48} color={colors.textLight} />
              <Text style={styles.emptyText}>
                No tasks yet. Create your first task to help your patient get started.
              </Text>
            </Card>
          ) : (
            allTasks.map((task) => (
              <Card key={task.id} style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <View style={styles.taskActions}>
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

                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                    {task.priority} priority
                  </Text>
                </View>

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
                      No steps yet. Add steps to guide your patient through this task.
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
                <Text style={styles.modalTitle}>Create New Task</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowTaskModal(false)}
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
                  placeholder="Add more details about this task..."
                  placeholderTextColor={colors.textLight}
                  multiline
                />
              </View>

              <View style={styles.datePickerContainer}>
                <Text style={styles.inputLabel}>Schedule For (Optional)</Text>
                <View style={[
                  styles.datePickerButton,
                  taskScheduledDate && styles.datePickerButtonActive,
                ]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 }}>
                    <CalendarIcon size={18} color={taskScheduledDate ? colors.primary : colors.textLight} />
                    <Text style={[
                      styles.datePickerText,
                      !taskScheduledDate && styles.datePickerTextPlaceholder,
                    ]}>
                      {taskScheduledDate 
                        ? taskScheduledDate.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric',
                            year: taskScheduledDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                          })
                        : 'Today (tap to change)'}
                    </Text>
                  </View>
                  {taskScheduledDate && (
                    <TouchableOpacity 
                      style={styles.clearDateButton}
                      onPress={() => setTaskScheduledDate(null)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <X size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
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

              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  onPress={() => setShowTaskModal(false)}
                  variant="secondary"
                  style={{ flex: 1 }}
                />
                <Button
                  title="Create Task"
                  onPress={handleCreateTask}
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
                    placeholder="e.g., Having the right bowl makes it easier to pour cereal"
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
    </PremiumGate>
  );
}
