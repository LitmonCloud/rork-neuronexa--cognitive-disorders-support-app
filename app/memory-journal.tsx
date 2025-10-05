import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput, Alert, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useDementia } from '@/contexts/DementiaContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { ArrowLeft, BookOpen, Plus, Trash2, Edit2, Sparkles, MapPin, Users, Heart, Frown, Meh, Smile, HelpCircle } from 'lucide-react-native';
import { useState } from 'react';
import { MemoryJournalEntry } from '@/types/dementia';
import { generateText } from '@rork/toolkit-sdk';

export default function MemoryJournalScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { memoryJournal, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useDementia();
  const { isPremium, canAccessFeature } = useSubscription();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    people: '',
  });
  const [selectedMood, setSelectedMood] = useState<'happy' | 'sad' | 'neutral' | 'confused' | 'anxious' | undefined>(undefined);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const hasAIAccess = isPremium || canAccessFeature('aiMemoryJournal');

  const handleGenerateAISuggestion = async () => {
    if (!hasAIAccess) {
      router.push('/paywall');
      return;
    }

    if (!formData.title && !formData.description) {
      Alert.alert('Need More Information', 'Please add a title or description first to get AI suggestions');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const prompt = `Based on this memory journal entry, provide helpful prompts and questions to help the person recall more details about this memory. Keep it warm, supportive, and focused on positive recall.

Title: ${formData.title}
Description: ${formData.description}
Location: ${formData.location}
People: ${formData.people}

Provide 3-4 gentle prompting questions that could help them remember more details.`;

      const suggestion = await generateText(prompt);
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
      Alert.alert('Error', 'Failed to generate AI suggestions. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSave = () => {
    if (!formData.title) {
      Alert.alert('Missing Information', 'Please enter a title for this memory');
      return;
    }

    const entry = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      people: formData.people ? formData.people.split(',').map(p => p.trim()) : [],
      mood: selectedMood,
      photoUris: [],
      date: new Date().toISOString(),
      tags: [],
    };

    if (editingId) {
      updateJournalEntry(editingId, entry);
      setEditingId(null);
    } else {
      addJournalEntry(entry);
      setIsAdding(false);
    }
    
    setFormData({ title: '', description: '', location: '', people: '' });
    setSelectedMood(undefined);
    setAiSuggestion('');
  };

  const handleEdit = (entry: MemoryJournalEntry) => {
    setEditingId(entry.id);
    setFormData({
      title: entry.title,
      description: entry.description || '',
      location: entry.location || '',
      people: entry.people?.join(', ') || '',
    });
    setSelectedMood(entry.mood);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Memory',
      'Are you sure you want to delete this memory?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteJournalEntry(id)
        }
      ]
    );
  };

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case 'happy': return <Smile size={20} color={colors.success} />;
      case 'sad': return <Frown size={20} color={colors.error} />;
      case 'neutral': return <Meh size={20} color={colors.textSecondary} />;
      case 'confused': return <HelpCircle size={20} color={colors.warning} />;
      case 'anxious': return <Heart size={20} color={colors.primary} />;
      default: return null;
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
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
      paddingHorizontal: 20,
      paddingTop: insets.top + 16,
      paddingBottom: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: colors.primaryLight,
    },
    backButtonText: {
      fontSize: 18,
      color: '#000000',
      fontWeight: '700' as const,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: colors.text,
      flex: 1,
      textAlign: 'center' as const,
      marginRight: 80,
    },
    content: {
      flex: 1,
    },
    section: {
      padding: 20,
    },
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 24,
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colors.surface,
    },
    journalCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    journalImage: {
      width: '100%',
      height: 150,
      borderRadius: 12,
      marginBottom: 12,
      backgroundColor: colors.borderLight,
    },
    journalHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    journalTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
      flex: 1,
      marginBottom: 4,
    },
    journalDate: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    journalDescription: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
      marginBottom: 12,
    },
    journalMeta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    metaChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
    },
    metaChipText: {
      fontSize: 12,
      color: colors.text,
      fontWeight: '500' as const,
    },
    journalActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
    },
    formCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 16,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top' as const,
    },
    moodSelector: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    moodButton: {
      flex: 1,
      padding: 12,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    moodButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },
    aiSection: {
      backgroundColor: colors.primaryLight,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    aiHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    aiTitle: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colors.primary,
    },
    aiButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    aiButtonText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.surface,
    },
    aiSuggestion: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
      marginTop: 8,
    },
    premiumBadge: {
      backgroundColor: colors.warning,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginLeft: 8,
    },
    premiumBadgeText: {
      fontSize: 10,
      fontWeight: '700' as const,
      color: colors.surface,
    },
    formActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    cancelButton: {
      flex: 1,
      padding: 14,
      borderRadius: 12,
      alignItems: 'center',
      backgroundColor: colors.borderLight,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
    },
    saveButton: {
      flex: 1,
      padding: 14,
      borderRadius: 12,
      alignItems: 'center',
      backgroundColor: colors.primary,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colors.surface,
    },
    emptyState: {
      alignItems: 'center',
      padding: 48,
    },
    emptyStateText: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      marginTop: 12,
      lineHeight: 22,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#000000" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Memory Journal</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {!isAdding && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAdding(true)}
              activeOpacity={0.7}
            >
              <Plus size={20} color={colors.surface} />
              <Text style={styles.addButtonText}>Add Memory</Text>
            </TouchableOpacity>
          )}

          {isAdding && (
            <View style={styles.formCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.formTitle}>
                  {editingId ? 'Edit Memory' : 'New Memory'}
                </Text>
                {!hasAIAccess && (
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumBadgeText}>AI PREMIUM</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  placeholder="What happened?"
                  placeholderTextColor={colors.textLight}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Tell me more about this memory..."
                  placeholderTextColor={colors.textLight}
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={formData.location}
                  onChangeText={(text) => setFormData({ ...formData, location: text })}
                  placeholder="Where did this happen?"
                  placeholderTextColor={colors.textLight}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>People (comma separated)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.people}
                  onChangeText={(text) => setFormData({ ...formData, people: text })}
                  placeholder="Who was there?"
                  placeholderTextColor={colors.textLight}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>How did you feel?</Text>
                <View style={styles.moodSelector}>
                  <TouchableOpacity
                    style={[styles.moodButton, selectedMood === 'happy' && styles.moodButtonSelected]}
                    onPress={() => setSelectedMood('happy')}
                    activeOpacity={0.7}
                  >
                    <Smile size={24} color={selectedMood === 'happy' ? colors.success : colors.textLight} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.moodButton, selectedMood === 'neutral' && styles.moodButtonSelected]}
                    onPress={() => setSelectedMood('neutral')}
                    activeOpacity={0.7}
                  >
                    <Meh size={24} color={selectedMood === 'neutral' ? colors.textSecondary : colors.textLight} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.moodButton, selectedMood === 'sad' && styles.moodButtonSelected]}
                    onPress={() => setSelectedMood('sad')}
                    activeOpacity={0.7}
                  >
                    <Frown size={24} color={selectedMood === 'sad' ? colors.error : colors.textLight} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.aiSection}>
                <View style={styles.aiHeader}>
                  <Sparkles size={20} color={colors.primary} />
                  <Text style={styles.aiTitle}>AI Memory Assistant</Text>
                </View>
                <TouchableOpacity
                  style={styles.aiButton}
                  onPress={handleGenerateAISuggestion}
                  activeOpacity={0.7}
                  disabled={isGeneratingAI}
                >
                  {isGeneratingAI ? (
                    <ActivityIndicator size="small" color={colors.surface} />
                  ) : (
                    <>
                      <Sparkles size={16} color={colors.surface} />
                      <Text style={styles.aiButtonText}>
                        {hasAIAccess ? 'Get Memory Prompts' : 'Unlock AI Prompts (Premium)'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
                {aiSuggestion && (
                  <Text style={styles.aiSuggestion}>{aiSuggestion}</Text>
                )}
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setFormData({ title: '', description: '', location: '', people: '' });
                    setSelectedMood(undefined);
                    setAiSuggestion('');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  activeOpacity={0.7}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {memoryJournal.length === 0 && !isAdding ? (
            <View style={styles.emptyState}>
              <BookOpen size={64} color={colors.textLight} />
              <Text style={styles.emptyStateText}>
                No memories recorded yet.{'\n'}
                Start capturing precious moments and memories.
              </Text>
            </View>
          ) : (
            memoryJournal.map(entry => (
              <View key={entry.id} style={styles.journalCard}>
                {entry.photoUris.length > 0 && entry.photoUris[0] && entry.photoUris[0].trim() !== '' && (
                  <Image source={{ uri: entry.photoUris[0] }} style={styles.journalImage} />
                )}
                
                <View style={styles.journalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.journalTitle}>{entry.title}</Text>
                    <Text style={styles.journalDate}>
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </Text>
                  </View>
                  {entry.mood && getMoodIcon(entry.mood)}
                </View>

                {entry.description && (
                  <Text style={styles.journalDescription}>{entry.description}</Text>
                )}

                <View style={styles.journalMeta}>
                  {entry.location && (
                    <View style={styles.metaChip}>
                      <MapPin size={12} color={colors.text} />
                      <Text style={styles.metaChipText}>{entry.location}</Text>
                    </View>
                  )}
                  {entry.people && entry.people.length > 0 && (
                    <View style={styles.metaChip}>
                      <Users size={12} color={colors.text} />
                      <Text style={styles.metaChipText}>{entry.people.join(', ')}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.journalActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { borderColor: colors.primary, backgroundColor: colors.primaryLight }]}
                    onPress={() => handleEdit(entry)}
                    activeOpacity={0.7}
                  >
                    <Edit2 size={16} color={colors.primary} />
                    <Text style={{ fontSize: 14, fontWeight: '600' as const, color: colors.primary }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { borderColor: colors.error, backgroundColor: colors.error + '10' }]}
                    onPress={() => handleDelete(entry.id)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
