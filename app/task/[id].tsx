import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useTasks } from '@/contexts/TaskContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useRetention } from '@/contexts/RetentionContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { CheckCircle2, Trash2, ArrowLeft, Volume2, Clock, Sparkles, Crown } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import VisualTimer from '@/components/VisualTimer';
import AITaskCoach from '@/components/AITaskCoach';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { allTasks, updateStep, deleteTask, completeTask } = useTasks();
  const { settings } = useAccessibility();
  const { updateStreak } = useRetention();
  const { colors } = useTheme();
  const { isPremium, isInTrial } = useSubscription();
  const [speakingStepId, setSpeakingStepId] = useState<string | null>(null);
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [useCoachMode, setUseCoachMode] = useState<boolean>(false);

  const task = allTasks.find(t => t.id === id);

  const textSize = settings.largeText ? 1.2 : 1;
  const completedSteps = task ? task.steps.filter(s => s.completed).length : 0;
  const progress = task && task.steps.length > 0 ? (completedSteps / task.steps.length) * 100 : 0;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    backButton: {
      padding: 8,
    },
    deleteButton: {
      padding: 8,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    header: {
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: colors.text,
      lineHeight: 36,
      flex: 1,
    },
    description: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    progressSection: {
      marginBottom: 32,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
    },
    progressText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '600' as const,
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    stepsSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 20,
      lineHeight: 20,
    },
    stepsList: {
      gap: 12,
    },
    stepCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 2,
    },
    stepCardCompleted: {
      backgroundColor: colors.success + '10',
      borderWidth: 1,
      borderColor: colors.success + '30',
    },
    stepCardHighContrast: {
      borderWidth: 2,
      borderColor: colors.text,
    },
    stepLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    stepNumber: {
      marginTop: 2,
    },
    stepNumberCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepNumberText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.primary,
    },
    stepText: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    stepTextCompleted: {
      color: colors.textSecondary,
    },
    noStepsContainer: {
      padding: 40,
      alignItems: 'center',
    },
    noStepsText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    completeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.success,
      borderRadius: 12,
      padding: 16,
      gap: 8,
      marginTop: 8,
    },
    completeButtonDisabled: {
      opacity: 0.5,
    },
    completeButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.surface,
    },
    completedBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.success + '20',
      borderRadius: 12,
      padding: 20,
      gap: 12,
      marginTop: 8,
      borderWidth: 1,
      borderColor: colors.success,
    },
    completedText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.success,
    },
    errorText: {
      fontSize: 16,
      color: colors.error,
      textAlign: 'center',
      marginTop: 40,
    },
    stepMainContent: {
      flex: 1,
    },
    speakButton: {
      padding: 8,
      marginTop: 8,
      alignSelf: 'flex-end',
      borderRadius: 8,
      backgroundColor: colors.background,
    },
    speakButtonActive: {
      backgroundColor: colors.primary + '20',
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    timerToggle: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary + '20',
    },
    timerSection: {
      marginBottom: 32,
    },
    timerTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 12,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    coachToggle: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary + '20',
    },
    coachToggleActive: {
      backgroundColor: colors.primary,
    },
    premiumBadge: {
      position: 'absolute' as const,
      top: -4,
      right: -4,
      backgroundColor: colors.warning,
      borderRadius: 8,
      padding: 2,
    },
    premiumOverlay: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      marginVertical: 20,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: 'center',
      gap: 16,
    },
    premiumIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primaryLight + '20',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
    },
    premiumCrown: {
      position: 'absolute' as const,
      top: -8,
      right: -8,
    },
    premiumTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      textAlign: 'center',
    },
    premiumDescription: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    premiumButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    premiumButtonText: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colors.surface,
    },
  });

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Task not found</Text>
      </View>
    );
  }

  const handleStepToggle = (stepId: string, completed: boolean) => {
    updateStep(task.id, stepId, completed);
  };

  const handleDeleteTask = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTask(task.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleCompleteTask = () => {
    completeTask(task.id);
    updateStreak();
    router.back();
  };

  const handleStepCompleteFromCoach = (stepId: string) => {
    updateStep(task.id, stepId, true);
  };

  const handleTaskCompleteFromCoach = () => {
    handleCompleteTask();
  };

  const speakStep = async (stepDescription: string, stepId: string) => {
    if (Platform.OS === 'web') {
      console.log('Speech not available on web');
      return;
    }
    
    if (speakingStepId === stepId) {
      Speech.stop();
      setSpeakingStepId(null);
    } else {
      setSpeakingStepId(stepId);
      await Speech.speak(stepDescription, {
        onDone: () => setSpeakingStepId(null),
        onStopped: () => setSpeakingStepId(null),
        onError: () => setSpeakingStepId(null),
      });
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleDeleteTask} style={styles.deleteButton}>
              <Trash2 size={20} color={colors.error} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { fontSize: 28 * textSize }]}>{task.title}</Text>
            <View style={styles.headerActions}>
              {settings.stepByStepMode && task.steps.length > 0 && (
                <TouchableOpacity
                  style={[styles.coachToggle, useCoachMode && styles.coachToggleActive]}
                  onPress={() => {
                    if (isPremium || isInTrial) {
                      setUseCoachMode(!useCoachMode);
                    } else {
                      router.push('/paywall');
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Sparkles size={20} color={useCoachMode ? colors.surface : colors.primary} />
                  {!isPremium && !isInTrial && (
                    <View style={styles.premiumBadge}>
                      <Crown size={12} color={colors.surface} />
                    </View>
                  )}
                </TouchableOpacity>
              )}
              {settings.cognitiveMode && (
                <TouchableOpacity
                  style={styles.timerToggle}
                  onPress={() => setShowTimer(!showTimer)}
                  activeOpacity={0.7}
                >
                  <Clock size={24} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {task.description && (
            <Text style={[styles.description, { fontSize: 16 * textSize }]}>
              {task.description}
            </Text>
          )}
        </View>

        {showTimer && settings.cognitiveMode && (
          <View style={styles.timerSection}>
            <Text style={[styles.timerTitle, { fontSize: 16 * textSize }]}>Focus Timer</Text>
            <VisualTimer 
              duration={task.timeEstimate || 1500} 
              textSize={textSize}
            />
          </View>
        )}

        {useCoachMode && settings.stepByStepMode && task.steps.length > 0 ? (
          (isPremium || isInTrial) ? (
            <AITaskCoach
              task={task}
              onStepComplete={handleStepCompleteFromCoach}
              onTaskComplete={handleTaskCompleteFromCoach}
            />
          ) : (
            <View style={styles.premiumOverlay}>
              <View style={styles.premiumIconContainer}>
                <Sparkles size={40} color={colors.primary} />
                <View style={styles.premiumCrown}>
                  <Crown size={24} color={colors.warning} />
                </View>
              </View>
              <Text style={[styles.premiumTitle, { fontSize: 20 * textSize }]}>
                AI Coach Mode
              </Text>
              <Text style={[styles.premiumDescription, { fontSize: 15 * textSize }]}>
                Get personalized step-by-step guidance with AI-powered coaching. Nexa will help you complete each step with encouragement and support tailored to your needs.
              </Text>
              <TouchableOpacity
                style={styles.premiumButton}
                onPress={() => router.push('/paywall')}
                activeOpacity={0.7}
              >
                <Crown size={20} color={colors.surface} />
                <Text style={[styles.premiumButtonText, { fontSize: 16 * textSize }]}>
                  Unlock Premium
                </Text>
              </TouchableOpacity>
            </View>
          )
        ) : task.steps.length > 0 && (
          <>
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressTitle, { fontSize: 16 * textSize }]}>
                  Your Progress
                </Text>
                <Text style={[styles.progressText, { fontSize: 14 * textSize }]}>
                  {completedSteps}/{task.steps.length} steps
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    { width: `${progress}%` },
                  ]} 
                />
              </View>
            </View>

            <View style={styles.stepsSection}>
              <Text style={[styles.sectionTitle, { fontSize: 18 * textSize }]}>
                Steps to Complete
              </Text>
              <Text style={[styles.sectionSubtitle, { fontSize: 14 * textSize }]}>
                Take it one step at a time. You&apos;ve got this!
              </Text>

              <View style={styles.stepsList}>
                {task.steps
                  .sort((a, b) => a.order - b.order)
                  .map((step, index) => (
                    <View
                      key={step.id}
                      style={[
                        styles.stepCard,
                        step.completed && styles.stepCardCompleted,
                        settings.highContrast && styles.stepCardHighContrast,
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.stepMainContent}
                        onPress={() => handleStepToggle(step.id, !step.completed)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.stepLeft}>
                          <View style={styles.stepNumber}>
                            {step.completed ? (
                              <CheckCircle2 size={24} color={colors.success} />
                            ) : (
                              <View style={styles.stepNumberCircle}>
                                <Text style={[styles.stepNumberText, { fontSize: 14 * textSize }]}>
                                  {index + 1}
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text
                            style={[
                              styles.stepText,
                              { fontSize: 16 * textSize },
                              step.completed && styles.stepTextCompleted,
                            ]}
                          >
                            {step.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {settings.voiceGuidance && Platform.OS !== 'web' && (
                        <TouchableOpacity
                          style={[
                            styles.speakButton,
                            speakingStepId === step.id && styles.speakButtonActive,
                          ]}
                          onPress={() => speakStep(step.description, step.id)}
                          activeOpacity={0.7}
                        >
                          <Volume2 
                            size={20} 
                            color={speakingStepId === step.id ? colors.primary : colors.textSecondary} 
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
              </View>
            </View>
          </>
        )}

        {task.steps.length === 0 && (
          <View style={styles.noStepsContainer}>
            <Text style={[styles.noStepsText, { fontSize: 16 * textSize }]}>
              AI is breaking down this task into simple steps...
            </Text>
          </View>
        )}

        {task.status !== 'completed' && task.steps.length > 0 && (
          <TouchableOpacity
            style={[
              styles.completeButton,
              completedSteps !== task.steps.length && styles.completeButtonDisabled,
            ]}
            onPress={handleCompleteTask}
            disabled={completedSteps !== task.steps.length}
            activeOpacity={0.7}
          >
            <CheckCircle2 size={20} color={colors.surface} />
            <Text style={[styles.completeButtonText, { fontSize: 16 * textSize }]}>
              Mark Task Complete
            </Text>
          </TouchableOpacity>
        )}

        {task.status === 'completed' && (
          <View style={styles.completedBanner}>
            <CheckCircle2 size={24} color={colors.success} />
            <Text style={[styles.completedText, { fontSize: 16 * textSize }]}>
              Great job! You completed this task!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
