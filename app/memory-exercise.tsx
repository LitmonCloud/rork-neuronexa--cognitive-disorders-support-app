import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { CheckCircle, ArrowLeft, Calendar, Eye, Wind, Move, Music, Image as ImageIcon, Heart } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { memoryExercises, orientationPrompts, sensoryGroundingSteps, gentleMovements } from '@/constants/memoryExercises';
import { useUserProfile } from '@/contexts/UserProfileContext';

export default function MemoryExerciseScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recordInteraction } = useUserProfile();
  
  const exercise = memoryExercises.find(e => e.id === id);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (!exercise) {
      router.back();
    }
  }, [exercise]);

  if (!exercise) {
    return null;
  }

  const getExerciseIcon = (iconName: string, size: number = 32) => {
    const iconProps = { size, color: colors.primary };
    switch (iconName) {
      case 'calendar': return <Calendar {...iconProps} />;
      case 'eye': return <Eye {...iconProps} />;
      case 'wind': return <Wind {...iconProps} />;
      case 'move': return <Move {...iconProps} />;
      case 'music': return <Music {...iconProps} />;
      case 'image': return <ImageIcon {...iconProps} />;
      default: return <Heart {...iconProps} />;
    }
  };

  const handleComplete = () => {
    setCompleted(true);
    recordInteraction('wellness_completed', 'positive', {
      exerciseId: exercise.id,
      exerciseType: exercise.type,
      duration: exercise.duration,
    });
  };

  const handleNextStep = () => {
    if (exercise.type === 'orientation' && currentStep < orientationPrompts.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (exercise.type === 'sensory-grounding' && currentStep < sensoryGroundingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (exercise.type === 'gentle-movement' && currentStep < gentleMovements.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const renderExerciseContent = () => {
    switch (exercise.type) {
      case 'orientation':
        if (completed) {
          return (
            <View style={styles.completedContainer}>
              <CheckCircle size={64} color={colors.success} />
              <Text style={styles.completedTitle}>Great Job!</Text>
              <Text style={styles.completedText}>
                You completed the orientation exercise
              </Text>
            </View>
          );
        }

        const prompt = orientationPrompts[currentStep];
        return (
          <View style={styles.exerciseContent}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${((currentStep + 1) / orientationPrompts.length) * 100}%`,
                    backgroundColor: exercise.color,
                  }
                ]} 
              />
            </View>
            
            <Text style={styles.stepCounter}>
              Question {currentStep + 1} of {orientationPrompts.length}
            </Text>

            <View style={styles.questionCard}>
              <Text style={styles.questionText}>{prompt.question}</Text>
              {prompt.hint && (
                <Text style={styles.hintText}>💡 {prompt.hint}</Text>
              )}
              
              <TextInput
                style={styles.answerInput}
                placeholder="Your answer..."
                placeholderTextColor={colors.textLight}
                value={answers[currentStep] || ''}
                onChangeText={(text) => {
                  const newAnswers = [...answers];
                  newAnswers[currentStep] = text;
                  setAnswers(newAnswers);
                }}
                multiline
              />
            </View>

            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: exercise.color }]}
              onPress={handleNextStep}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === orientationPrompts.length - 1 ? 'Finish' : 'Next Question'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'sensory-grounding':
        if (completed) {
          return (
            <View style={styles.completedContainer}>
              <CheckCircle size={64} color={colors.success} />
              <Text style={styles.completedTitle}>Well Done!</Text>
              <Text style={styles.completedText}>
                You completed the grounding exercise
              </Text>
            </View>
          );
        }

        const groundingStep = sensoryGroundingSteps[currentStep];
        return (
          <View style={styles.exerciseContent}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${((currentStep + 1) / sensoryGroundingSteps.length) * 100}%`,
                    backgroundColor: exercise.color,
                  }
                ]} 
              />
            </View>

            <Text style={styles.stepCounter}>
              Step {currentStep + 1} of {sensoryGroundingSteps.length}
            </Text>

            <View style={styles.groundingCard}>
              <Text style={styles.groundingPrompt}>{groundingStep.prompt}</Text>
              <Text style={styles.groundingCount}>
                Think of {groundingStep.count} thing{groundingStep.count > 1 ? 's' : ''}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: exercise.color }]}
              onPress={handleNextStep}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === sensoryGroundingSteps.length - 1 ? 'Finish' : 'Next Step'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'gentle-movement':
        if (completed) {
          return (
            <View style={styles.completedContainer}>
              <CheckCircle size={64} color={colors.success} />
              <Text style={styles.completedTitle}>Excellent!</Text>
              <Text style={styles.completedText}>
                You completed the movement exercise
              </Text>
            </View>
          );
        }

        const movement = gentleMovements[currentStep];
        return (
          <View style={styles.exerciseContent}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${((currentStep + 1) / gentleMovements.length) * 100}%`,
                    backgroundColor: exercise.color,
                  }
                ]} 
              />
            </View>

            <Text style={styles.stepCounter}>
              Movement {currentStep + 1} of {gentleMovements.length}
            </Text>

            <View style={styles.movementCard}>
              <Text style={styles.movementName}>{movement.name}</Text>
              <Text style={styles.movementInstruction}>{movement.instruction}</Text>
              <Text style={styles.movementDuration}>{movement.duration} seconds</Text>
            </View>

            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: exercise.color }]}
              onPress={handleNextStep}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === gentleMovements.length - 1 ? 'Finish' : 'Next Movement'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'simple-breathing':
        return (
          <View style={styles.exerciseContent}>
            <View style={styles.simpleBreathingCard}>
              <Text style={styles.simpleBreathingTitle}>Breathe In</Text>
              <Text style={styles.simpleBreathingSubtitle}>Slowly through your nose</Text>
              <View style={styles.breathingDivider} />
              <Text style={styles.simpleBreathingTitle}>Breathe Out</Text>
              <Text style={styles.simpleBreathingSubtitle}>Slowly through your mouth</Text>
            </View>

            <Text style={styles.simpleBreathingInstruction}>
              Repeat this a few times until you feel calm
            </Text>

            {!completed && (
              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: exercise.color }]}
                onPress={handleComplete}
              >
                <Text style={styles.nextButtonText}>I Feel Better</Text>
              </TouchableOpacity>
            )}

            {completed && (
              <View style={styles.completedContainer}>
                <CheckCircle size={64} color={colors.success} />
                <Text style={styles.completedTitle}>Great!</Text>
              </View>
            )}
          </View>
        );

      case 'music-memory':
      case 'photo-recall':
        return (
          <View style={styles.exerciseContent}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>How to do this exercise:</Text>
              {exercise.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionRow}>
                  <Text style={styles.instructionNumber}>{index + 1}.</Text>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>

            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsTitle}>Benefits:</Text>
              {exercise.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitRow}>
                  <Text style={styles.benefitBullet}>•</Text>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            {!completed && (
              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: exercise.color }]}
                onPress={handleComplete}
              >
                <Text style={styles.nextButtonText}>I Finished</Text>
              </TouchableOpacity>
            )}

            {completed && (
              <View style={styles.completedContainer}>
                <CheckCircle size={64} color={colors.success} />
                <Text style={styles.completedTitle}>Wonderful!</Text>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
    },
    headerContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${exercise.color}20`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    scrollContent: {
      padding: 20,
    },
    exerciseContent: {
      gap: 24,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    stepCounter: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.textSecondary,
      textAlign: 'center' as const,
    },
    questionCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      borderWidth: 2,
      borderColor: colors.border,
    },
    questionText: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 16,
      lineHeight: 32,
    },
    hintText: {
      fontSize: 15,
      color: colors.textSecondary,
      marginBottom: 16,
      fontStyle: 'italic' as const,
    },
    answerInput: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      fontSize: 18,
      color: colors.text,
      borderWidth: 2,
      borderColor: colors.border,
      minHeight: 80,
      textAlignVertical: 'top' as const,
    },
    groundingCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 32,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
    },
    groundingPrompt: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: colors.text,
      textAlign: 'center' as const,
      marginBottom: 16,
      lineHeight: 34,
    },
    groundingCount: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center' as const,
    },
    movementCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 32,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
    },
    movementName: {
      fontSize: 26,
      fontWeight: '800' as const,
      color: colors.text,
      marginBottom: 16,
    },
    movementInstruction: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      marginBottom: 16,
      lineHeight: 26,
    },
    movementDuration: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.primary,
    },
    simpleBreathingCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 40,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
    },
    simpleBreathingTitle: {
      fontSize: 32,
      fontWeight: '800' as const,
      color: colors.text,
      marginBottom: 8,
    },
    simpleBreathingSubtitle: {
      fontSize: 18,
      color: colors.textSecondary,
    },
    breathingDivider: {
      width: 60,
      height: 3,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginVertical: 32,
    },
    simpleBreathingInstruction: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      lineHeight: 24,
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      borderWidth: 2,
      borderColor: colors.border,
    },
    infoTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 16,
    },
    instructionRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12,
    },
    instructionNumber: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.primary,
    },
    instructionText: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    benefitsCard: {
      backgroundColor: `${colors.success}10`,
      borderRadius: 16,
      padding: 24,
      borderWidth: 2,
      borderColor: `${colors.success}30`,
    },
    benefitsTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 12,
    },
    benefitRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 8,
    },
    benefitBullet: {
      fontSize: 18,
      color: colors.success,
      fontWeight: '700' as const,
    },
    benefitText: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
    },
    nextButton: {
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      marginTop: 8,
    },
    nextButtonText: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: '#FFFFFF',
    },
    completedContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    completedTitle: {
      fontSize: 28,
      fontWeight: '800' as const,
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    completedText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center' as const,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            {getExerciseIcon(exercise.icon)}
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{exercise.title}</Text>
            <Text style={styles.headerSubtitle}>{exercise.duration} min • {exercise.difficulty}</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderExerciseContent()}
      </ScrollView>
    </SafeAreaView>
  );
}
