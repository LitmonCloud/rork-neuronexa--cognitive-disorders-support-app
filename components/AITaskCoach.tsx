import { StyleSheet, Text, View, TouchableOpacity, Platform, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Task, TaskStep } from '@/types/task';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import colors from '@/constants/colors';
import { CheckCircle2, Volume2, ChevronRight, ChevronLeft, Sparkles, Image as ImageIcon } from 'lucide-react-native';
import * as Speech from 'expo-speech';

interface AITaskCoachProps {
  task: Task;
  onStepComplete: (stepId: string) => void;
  onTaskComplete: () => void;
}

export default function AITaskCoach({ task, onStepComplete, onTaskComplete }: AITaskCoachProps) {
  const { settings } = useAccessibility();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const currentStep = task.steps[currentStepIndex];
  const completedSteps = task.steps.filter(s => s.completed).length;
  const isLastStep = currentStepIndex === task.steps.length - 1;
  const canGoNext = currentStepIndex < task.steps.length - 1;
  const canGoPrev = currentStepIndex > 0;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    if (settings.autoReadSteps && currentStep && !currentStep.completed) {
      speakStep(currentStep);
    }
  }, [currentStepIndex, fadeAnim, scaleAnim, settings.autoReadSteps, currentStep]);

  const speakStep = async (step: TaskStep) => {
    if (Platform.OS === 'web') return;
    
    const textToSpeak = settings.simplifiedLanguage && step.simplifiedText 
      ? step.simplifiedText 
      : step.description;
    
    const contextPrompt = step.contextualPrompt 
      ? `${step.contextualPrompt}. ` 
      : '';

    setIsSpeaking(true);
    await Speech.speak(`${contextPrompt}${textToSpeak}`, {
      rate: 0.85,
      pitch: 1.0,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleStepComplete = () => {
    if (!currentStep) return;

    onStepComplete(currentStep.id);
    setShowEncouragement(true);

    setTimeout(() => {
      setShowEncouragement(false);
      if (canGoNext) {
        handleNext();
      } else {
        onTaskComplete();
      }
    }, 1500);
  };

  const handleNext = () => {
    if (canGoNext) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const textSize = settings.largeText ? 1.3 : 1;

  if (!currentStep) {
    return (
      <View style={styles.container}>
        <Text style={[styles.emptyText, { fontSize: 16 * textSize }]}>
          No steps available
        </Text>
      </View>
    );
  }

  const encouragements = [
    "Great job! You're doing amazing!",
    "Excellent work! Keep it up!",
    "You're making great progress!",
    "Well done! You've got this!",
    "Fantastic! One step closer!",
  ];

  const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressIndicator}>
          <Sparkles size={20} color={colors.primary} />
          <Text style={[styles.progressText, { fontSize: 14 * textSize }]}>
            Step {currentStepIndex + 1} of {task.steps.length}
          </Text>
        </View>
        <View style={styles.completionBadge}>
          <CheckCircle2 size={16} color={colors.success} />
          <Text style={[styles.completionText, { fontSize: 12 * textSize }]}>
            {completedSteps} completed
          </Text>
        </View>
      </View>

      <Animated.View 
        style={[
          styles.stepCard,
          settings.highContrast && styles.stepCardHighContrast,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {currentStep.contextualPrompt && (
          <View style={styles.contextPrompt}>
            <Text style={[styles.contextText, { fontSize: 14 * textSize }]}>
              {currentStep.contextualPrompt}
            </Text>
          </View>
        )}

        <View style={styles.stepContent}>
          <View style={styles.stepNumber}>
            {currentStep.completed ? (
              <CheckCircle2 size={32} color={colors.success} />
            ) : (
              <View style={styles.stepNumberCircle}>
                <Text style={[styles.stepNumberText, { fontSize: 20 * textSize }]}>
                  {currentStepIndex + 1}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.stepTextContainer}>
            <Text style={[styles.stepTitle, { fontSize: 20 * textSize }]}>
              {settings.simplifiedLanguage && currentStep.simplifiedText
                ? currentStep.simplifiedText
                : currentStep.description}
            </Text>

            {currentStep.visualAid && settings.visualCuesEnabled && (
              <View style={styles.visualAidContainer}>
                <ImageIcon size={20} color={colors.primary} />
                <Text style={[styles.visualAidText, { fontSize: 12 * textSize }]}>
                  Visual guide available
                </Text>
              </View>
            )}
          </View>
        </View>

        {settings.voiceGuidance && Platform.OS !== 'web' && (
          <TouchableOpacity
            style={[styles.speakButton, isSpeaking && styles.speakButtonActive]}
            onPress={() => speakStep(currentStep)}
            activeOpacity={0.7}
          >
            <Volume2 size={20} color={isSpeaking ? colors.primary : colors.textSecondary} />
            <Text style={[styles.speakButtonText, { fontSize: 14 * textSize }]}>
              {isSpeaking ? 'Speaking...' : 'Read aloud'}
            </Text>
          </TouchableOpacity>
        )}

        {!currentStep.completed && (
          <TouchableOpacity
            style={styles.completeStepButton}
            onPress={handleStepComplete}
            activeOpacity={0.7}
          >
            <CheckCircle2 size={20} color={colors.surface} />
            <Text style={[styles.completeStepButtonText, { fontSize: 16 * textSize }]}>
              {isLastStep ? 'Complete Task' : 'Mark Complete & Continue'}
            </Text>
          </TouchableOpacity>
        )}

        {currentStep.completed && (
          <View style={styles.completedBadge}>
            <CheckCircle2 size={24} color={colors.success} />
            <Text style={[styles.completedBadgeText, { fontSize: 16 * textSize }]}>
              Step Completed!
            </Text>
          </View>
        )}
      </Animated.View>

      {showEncouragement && (
        <Animated.View style={[styles.encouragementBanner, { opacity: fadeAnim }]}>
          <Sparkles size={24} color={colors.warning} />
          <Text style={[styles.encouragementText, { fontSize: 18 * textSize }]}>
            {randomEncouragement}
          </Text>
        </Animated.View>
      )}

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, !canGoPrev && styles.navButtonDisabled]}
          onPress={handlePrev}
          disabled={!canGoPrev}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color={canGoPrev ? colors.primary : colors.border} />
          <Text style={[
            styles.navButtonText,
            { fontSize: 14 * textSize },
            !canGoPrev && styles.navButtonTextDisabled,
          ]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, !canGoNext && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={!canGoNext}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.navButtonText,
            { fontSize: 14 * textSize },
            !canGoNext && styles.navButtonTextDisabled,
          ]}>
            Next
          </Text>
          <ChevronRight size={24} color={canGoNext ? colors.primary : colors.border} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.success + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completionText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.success,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  stepCardHighContrast: {
    borderWidth: 3,
    borderColor: colors.text,
  },
  contextPrompt: {
    backgroundColor: colors.warning + '15',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  contextText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  stepContent: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  stepNumber: {
    marginTop: 4,
  },
  stepNumberCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
    lineHeight: 28,
    marginBottom: 12,
  },
  visualAidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  visualAidText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500' as const,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  speakButtonActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  speakButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  completeStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.success,
    borderRadius: 16,
    padding: 18,
  },
  completeStepButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.surface,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.success + '20',
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: colors.success,
  },
  completedBadgeText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.success,
  },
  encouragementBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.warning + '20',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.warning,
  },
  encouragementText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  navButtonDisabled: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  navButtonTextDisabled: {
    color: colors.border,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
