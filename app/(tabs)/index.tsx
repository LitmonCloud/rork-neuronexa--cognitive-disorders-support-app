import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Animated, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Plus, Sparkles, Circle, CheckCircle2, Clock, Heart, Smile, Crown } from 'lucide-react-native';
import { Task, TaskPriority } from '@/types/task';
import { router } from 'expo-router';

export default function TasksScreen() {
  const { tasks, filter, setFilter, addTask, breakdownTask } = useTasks();
  const { settings } = useAccessibility();
  const { canCreateTask, incrementTaskUsage, getRemainingTasks, isPremium, isInTrial } = useSubscription();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [isCreating, setIsCreating] = useState(false);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    if (!canCreateTask()) {
      setShowAddWidget(false);
      router.push('/paywall');
      return;
    }
    
    setIsCreating(true);
    Keyboard.dismiss();
    try {
      const task = await addTask(newTaskTitle, newTaskDescription || undefined, newTaskPriority);
      if (task) {
        incrementTaskUsage();
        await breakdownTask(task.id);
      }
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setShowAddWidget(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseWidget = () => {
    setShowAddWidget(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    Keyboard.dismiss();
  };

  const getStatusIcon = (task: Task) => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle2 size={24} color={colors.success} />;
      case 'in-progress':
        return <Clock size={24} color={colors.warning} />;
      default:
        return <Circle size={24} color={colors.textLight} />;
    }
  };

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

  const textSize = settings.largeText ? 1.2 : 1;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const widgetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  useEffect(() => {
    Animated.spring(widgetAnim, {
      toValue: showAddWidget ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [showAddWidget, widgetAnim]);

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const widgetTranslateY = widgetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-400, 0],
  });

  const widgetOpacity = widgetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      position: 'relative' as const,
    },
    decorativeBackground: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: 400,
      overflow: 'hidden' as const,
    },
    decorativeCircle: {
      position: 'absolute' as const,
      borderRadius: 1000,
      opacity: 0.15,
    },
    decorativeCircle1: {
      width: 200,
      height: 200,
      backgroundColor: colors.decorative.lavender,
      top: -50,
      right: -50,
    },
    decorativeCircle2: {
      width: 150,
      height: 150,
      backgroundColor: colors.decorative.mint,
      top: 100,
      left: -30,
    },
    decorativeCircle3: {
      width: 100,
      height: 100,
      backgroundColor: colors.decorative.peach,
      top: 250,
      right: 50,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 28,
    },
    headerContent: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6,
    },
    premiumBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.primaryLight + '30',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    premiumText: {
      fontSize: 11,
      fontWeight: '700' as const,
      color: colors.primary,
      textTransform: 'uppercase' as const,
    },
    upgradePrompt: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: colors.primaryLight + '20',
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    upgradePromptText: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: colors.primary,
    },
    greetingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 6,
    },
    greeting: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '500' as const,
    },
    greetingIcon: {
      marginTop: 2,
    },
    title: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: colors.text,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
    },
    addButton: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 6,
    },
    filterContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 24,
    },
    filterChip: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 24,
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 1,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOpacity: 0.3,
    },
    filterChipText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500' as const,
    },
    filterChipTextActive: {
      color: colors.surface,
      fontWeight: '600' as const,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
    },
    emptyIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primaryLight + '30',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 10,
    },
    emptyText: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    emptyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 24,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    emptyButtonText: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: colors.surface,
    },
    taskList: {
      gap: 12,
    },
    taskCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 18,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    taskCardHighContrast: {
      borderWidth: 2,
      borderColor: colors.text,
    },
    taskLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
    },
    taskContent: {
      flex: 1,
    },
    taskTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 4,
    },
    taskTitleCompleted: {
      textDecorationLine: 'line-through' as const,
      color: colors.textSecondary,
    },
    taskSteps: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    priorityIndicator: {
      width: 4,
      height: 40,
      borderRadius: 2,
      marginLeft: 12,
    },
    widgetOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.overlay,
    },
    floatingWidget: {
      position: 'absolute' as const,
      top: 0,
      left: 20,
      right: 20,
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 12,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    widgetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    widgetTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    widgetTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surfaceTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeButtonText: {
      fontSize: 28,
      color: colors.textSecondary,
      fontWeight: '300' as const,
      lineHeight: 32,
    },
    widgetInput: {
      backgroundColor: colors.surfaceTint,
      borderRadius: 14,
      padding: 14,
      fontSize: 16,
      color: colors.text,
      marginBottom: 10,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    widgetInputMultiline: {
      height: 60,
      textAlignVertical: 'top' as const,
    },
    widgetPriorityContainer: {
      marginBottom: 16,
    },
    widgetPriorityLabel: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: colors.textSecondary,
      marginBottom: 8,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
    widgetPriorityButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    widgetPriorityButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.surfaceTint,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
    },
    widgetPriorityButtonText: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '500' as const,
    },
    widgetPriorityButtonTextActive: {
      color: colors.surface,
      fontWeight: '600' as const,
    },
    widgetCreateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 14,
      padding: 14,
      gap: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    widgetCreateButtonDisabled: {
      opacity: 0.5,
    },
    widgetCreateButtonText: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: colors.surface,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.decorativeBackground}>
        <Animated.View style={[styles.decorativeCircle, styles.decorativeCircle1, { transform: [{ translateY: floatTranslate }] }]} />
        <Animated.View style={[styles.decorativeCircle, styles.decorativeCircle2, { transform: [{ translateY: floatTranslate }] }]} />
        <Animated.View style={[styles.decorativeCircle, styles.decorativeCircle3, { transform: [{ translateY: floatTranslate }] }]} />
      </View>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.greetingContainer}>
              <Text style={[styles.greeting, { fontSize: 16 * textSize }]}>{getGreeting()}</Text>
              <Smile size={20} color={colors.accent} style={styles.greetingIcon} />
            </View>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { fontSize: 28 * textSize }]}>NeuroNexa</Text>
              {(isPremium || isInTrial) && (
                <View style={styles.premiumBadge}>
                  <Crown size={14} color={colors.primary} />
                  <Text style={styles.premiumText}>{isInTrial ? 'Trial' : 'Premium'}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.subtitle, { fontSize: 15 * textSize }]}>
{tasks.length === 0 ? "Let's start your journey" : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} to focus on`}
            </Text>
            {!isPremium && !isInTrial && (
              <TouchableOpacity 
                style={styles.upgradePrompt}
                onPress={() => router.push('/paywall')}
                activeOpacity={0.7}
              >
                <Text style={styles.upgradePromptText}>
                  {getRemainingTasks() === -1 ? 'Unlimited tasks' : `${getRemainingTasks()} tasks remaining today`}
                </Text>
                <Sparkles size={14} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddWidget(true)}
            activeOpacity={0.7}
          >
            <Plus size={22} color={colors.surface} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          {(['all', 'pending', 'in-progress', 'completed'] as const).map((filterOption) => (
            <TouchableOpacity
              key={filterOption}
              style={[
                styles.filterChip,
                filter === filterOption && styles.filterChipActive,
              ]}
              onPress={() => setFilter(filterOption)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { fontSize: 14 * textSize },
                  filter === filterOption && styles.filterChipTextActive,
                ]}
              >
                {filterOption === 'all' ? 'All' : 
                 filterOption === 'pending' ? 'To Do' :
                 filterOption === 'in-progress' ? 'In Progress' : 'Done'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Heart size={40} color={colors.primary} />
            </View>
<Text style={[styles.emptyTitle, { fontSize: 22 * textSize }]}>
              You&apos;re doing great
            </Text>
            <Text style={[styles.emptyText, { fontSize: 15 * textSize }]}>
              Take a moment to add a task. We&apos;ll help you break it down into simple, manageable steps.
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => setShowAddWidget(true)}
              activeOpacity={0.7}
            >
              <Plus size={18} color={colors.surface} />
              <Text style={[styles.emptyButtonText, { fontSize: 15 * textSize }]}>Add your first task</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.taskList}>
            {tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[
                  styles.taskCard,
                  settings.highContrast && styles.taskCardHighContrast,
                ]}
                onPress={() => router.push(`/task/${task.id}` as any)}
                activeOpacity={0.7}
              >
                <View style={styles.taskLeft}>
                  {getStatusIcon(task)}
                  <View style={styles.taskContent}>
                    <Text 
                      style={[
                        styles.taskTitle, 
                        { fontSize: 16 * textSize },
                        task.status === 'completed' && styles.taskTitleCompleted,
                      ]}
                      numberOfLines={2}
                    >
                      {task.title}
                    </Text>
                    {task.steps.length > 0 && (
                      <Text style={[styles.taskSteps, { fontSize: 13 * textSize }]}>
                        {task.steps.filter(s => s.completed).length}/{task.steps.length} steps
                      </Text>
                    )}
                  </View>
                </View>
                <View 
                  style={[
                    styles.priorityIndicator,
                    { backgroundColor: getPriorityColor(task.priority) },
                  ]} 
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {showAddWidget && (
        <TouchableOpacity 
          style={styles.widgetOverlay}
          activeOpacity={1}
          onPress={handleCloseWidget}
        >
          <Animated.View 
            style={[
              styles.floatingWidget,
              { 
                paddingTop: insets.top + 20,
                transform: [{ translateY: widgetTranslateY }],
                opacity: widgetOpacity,
              }
            ]}
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.widgetHeader}>
                <View style={styles.widgetTitleContainer}>
                  <Sparkles size={20} color={colors.primary} />
                  <Text style={[styles.widgetTitle, { fontSize: 20 * textSize }]}>New Task</Text>
                </View>
                <TouchableOpacity onPress={handleCloseWidget} style={styles.closeButton}>
                  <Text style={[styles.closeButtonText, { fontSize: 28 * textSize }]}>×</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={[styles.widgetInput, { fontSize: 16 * textSize }]}
                placeholder="What do you need to do?"
                placeholderTextColor={colors.textLight}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                autoFocus
              />

              <TextInput
                style={[styles.widgetInput, styles.widgetInputMultiline, { fontSize: 15 * textSize }]}
                placeholder="Add more details (optional)"
                placeholderTextColor={colors.textLight}
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                multiline
                numberOfLines={2}
              />

              <View style={styles.widgetPriorityContainer}>
                <Text style={[styles.widgetPriorityLabel, { fontSize: 12 * textSize }]}>Priority</Text>
                <View style={styles.widgetPriorityButtons}>
                  {(['low', 'medium', 'high'] as TaskPriority[]).map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.widgetPriorityButton,
                        newTaskPriority === priority && {
                          backgroundColor: getPriorityColor(priority),
                        },
                      ]}
                      onPress={() => setNewTaskPriority(priority)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.widgetPriorityButtonText,
                          { fontSize: 13 * textSize },
                          newTaskPriority === priority && styles.widgetPriorityButtonTextActive,
                        ]}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.widgetCreateButton,
                  (!newTaskTitle.trim() || isCreating) && styles.widgetCreateButtonDisabled,
                ]}
                onPress={handleAddTask}
                disabled={!newTaskTitle.trim() || isCreating}
                activeOpacity={0.7}
              >
                {isCreating ? (
                  <ActivityIndicator color={colors.surface} />
                ) : (
                  <>
                    <Sparkles size={18} color={colors.surface} />
                    <Text style={[styles.widgetCreateButtonText, { fontSize: 15 * textSize }]}>
                      Create with AI
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
}
