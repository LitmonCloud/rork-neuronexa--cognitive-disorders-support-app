import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { CheckCircle, ArrowLeft, Calendar, Eye, Wind, Move, Music, Image as ImageIcon, Heart, Plus, Edit2, Trash2, X, Camera } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { memoryExercises, orientationPrompts, sensoryGroundingSteps, gentleMovements } from '@/constants/memoryExercises';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { usePhotoMemory } from '@/contexts/PhotoMemoryContext';
import * as ImagePicker from 'expo-image-picker';

export default function MemoryExerciseScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recordInteraction } = useUserProfile();
  const { photos, addPhoto, updatePhoto, deletePhoto } = usePhotoMemory();
  
  const exercise = memoryExercises.find(e => e.id === id);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState('');
  const [photoRelationship, setPhotoRelationship] = useState('');
  const [photoNotes, setPhotoNotes] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

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

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      if (Platform.OS === 'web') {
        alert('Permission to access camera roll is required!');
      } else {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      }
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedImageUri || !photoName.trim()) {
      if (Platform.OS === 'web') {
        alert('Please select an image and enter a name');
      } else {
        Alert.alert('Missing Information', 'Please select an image and enter a name');
      }
      return;
    }

    try {
      if (editingPhoto) {
        await updatePhoto(editingPhoto, {
          uri: selectedImageUri,
          name: photoName.trim(),
          relationship: photoRelationship.trim() || undefined,
          notes: photoNotes.trim() || undefined,
        });
      } else {
        await addPhoto({
          uri: selectedImageUri,
          name: photoName.trim(),
          relationship: photoRelationship.trim() || undefined,
          notes: photoNotes.trim() || undefined,
        });
      }
      setShowAddPhotoModal(false);
      setEditingPhoto(null);
      setPhotoName('');
      setPhotoRelationship('');
      setPhotoNotes('');
      setSelectedImageUri(null);
    } catch (error) {
      console.error('Failed to save photo:', error);
      if (Platform.OS === 'web') {
        alert('Failed to save photo. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to save photo. Please try again.');
      }
    }
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

      case 'photo-recall':
        return (
          <View style={styles.exerciseContent}>
            <View style={styles.photoHeader}>
              <Text style={styles.photoHeaderTitle}>My Photo Memories</Text>
              <TouchableOpacity
                style={[styles.addPhotoButton, { backgroundColor: exercise.color }]}
                onPress={() => {
                  setEditingPhoto(null);
                  setPhotoName('');
                  setPhotoRelationship('');
                  setPhotoNotes('');
                  setSelectedImageUri(null);
                  setShowAddPhotoModal(true);
                }}
              >
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.addPhotoButtonText}>Add Photo</Text>
              </TouchableOpacity>
            </View>

            {photos.length === 0 ? (
              <View style={styles.emptyState}>
                <ImageIcon size={48} color={colors.textLight} />
                <Text style={styles.emptyStateTitle}>No Photos Yet</Text>
                <Text style={styles.emptyStateText}>
                  Add photos of family and friends to help with memory recall
                </Text>
              </View>
            ) : (
              <View style={styles.photoGrid}>
                {photos.map((photo) => {
                  if (!photo.uri) {
                    console.warn('Photo missing uri:', photo);
                    return null;
                  }
                  return (
                  <View key={photo.id} style={styles.photoCard}>
                    <Image 
                      source={{ uri: photo.uri }} 
                      style={styles.photoImage}
                      resizeMode="cover"
                    />
                    <View style={styles.photoInfo}>
                      <Text style={styles.photoName}>{photo.name}</Text>
                      {photo.relationship && (
                        <Text style={styles.photoRelationship}>{photo.relationship}</Text>
                      )}
                      {photo.notes && (
                        <Text style={styles.photoNotes} numberOfLines={2}>{photo.notes}</Text>
                      )}
                    </View>
                    <View style={styles.photoActions}>
                      <TouchableOpacity
                        style={styles.photoActionButton}
                        onPress={() => {
                          setEditingPhoto(photo.id);
                          setPhotoName(photo.name);
                          setPhotoRelationship(photo.relationship || '');
                          setPhotoNotes(photo.notes || '');
                          setSelectedImageUri(photo.uri);
                          setShowAddPhotoModal(true);
                        }}
                      >
                        <Edit2 size={18} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.photoActionButton}
                        onPress={() => {
                          if (Platform.OS === 'web') {
                            if (confirm('Delete this photo?')) {
                              deletePhoto(photo.id);
                            }
                          } else {
                            Alert.alert(
                              'Delete Photo',
                              'Are you sure you want to delete this photo?',
                              [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: () => deletePhoto(photo.id) },
                              ]
                            );
                          }
                        }}
                      >
                        <Trash2 size={18} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  );
                })}
              </View>
            )}

            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsTitle}>Benefits:</Text>
              {exercise.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitRow}>
                  <Text style={styles.benefitBullet}>•</Text>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            {!completed && photos.length > 0 && (
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
    photoHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    photoHeaderTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
    },
    addPhotoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
    },
    addPhotoButtonText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 48,
      paddingHorizontal: 24,
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed' as const,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      lineHeight: 20,
    },
    photoGrid: {
      gap: 16,
      marginBottom: 24,
    },
    photoCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.border,
    },
    photoImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 12,
      backgroundColor: colors.border,
    },
    photoInfo: {
      marginBottom: 12,
    },
    photoName: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 4,
    },
    photoRelationship: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    photoNotes: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    photoActions: {
      flexDirection: 'row',
      gap: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    photoActionButton: {
      padding: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      width: '100%',
      maxWidth: 400,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: colors.text,
    },
    modalCloseButton: {
      padding: 4,
    },
    modalImagePreview: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 16,
      backgroundColor: colors.border,
    },
    modalImagePlaceholder: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 16,
      backgroundColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed' as const,
    },
    selectImageButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginBottom: 16,
    },
    selectImageButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
    modalInput: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 2,
      borderColor: colors.border,
      marginBottom: 12,
    },
    modalInputMultiline: {
      minHeight: 80,
      textAlignVertical: 'top' as const,
    },
    modalLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    modalButton: {
      flex: 1,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    modalButtonPrimary: {
      backgroundColor: colors.primary,
    },
    modalButtonSecondary: {
      backgroundColor: colors.border,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
    modalButtonTextSecondary: {
      color: colors.text,
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

      <Modal
        visible={showAddPhotoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddPhotoModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddPhotoModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingPhoto ? 'Edit Photo' : 'Add Photo'}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowAddPhotoModal(false)}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedImageUri ? (
              <Image 
                source={{ uri: selectedImageUri }} 
                style={styles.modalImagePreview}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.modalImagePlaceholder}>
                <Camera size={48} color={colors.textLight} />
                <Text style={{ color: colors.textLight, marginTop: 12 }}>No image selected</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.selectImageButton}
              onPress={pickImage}
            >
              <Text style={styles.selectImageButtonText}>
                {selectedImageUri ? 'Change Photo' : 'Select Photo'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.modalLabel}>Name *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter name"
              placeholderTextColor={colors.textLight}
              value={photoName}
              onChangeText={setPhotoName}
            />

            <Text style={styles.modalLabel}>Relationship (optional)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., Daughter, Friend, Neighbor"
              placeholderTextColor={colors.textLight}
              value={photoRelationship}
              onChangeText={setPhotoRelationship}
            />

            <Text style={styles.modalLabel}>Notes (optional)</Text>
            <TextInput
              style={[styles.modalInput, styles.modalInputMultiline]}
              placeholder="Add any helpful notes or memories"
              placeholderTextColor={colors.textLight}
              value={photoNotes}
              onChangeText={setPhotoNotes}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowAddPhotoModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSavePhoto}
              >
                <Text style={styles.modalButtonText}>
                  {editingPhoto ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
