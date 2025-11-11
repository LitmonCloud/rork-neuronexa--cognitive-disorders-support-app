import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { VoiceInputButton } from '@/components/VoiceInputButton';
import { AccessibilityControls } from '@/components/AccessibilityControls';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { Volume2 } from 'lucide-react-native';
import { Button } from '@/components/Button';

export default function AccessibilityTestScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { settings } = useAccessibility();
  const { speak, stop, isSpeaking } = useTextToSpeech();

  const [voiceInput, setVoiceInput] = useState('');
  const [textToSpeak, setTextToSpeak] = useState('Hello! This is a test of the text to speech feature.');

  const handleVoiceInput = (text: string) => {
    setVoiceInput(text);
    console.log('[AccessibilityTest] Voice input:', text);
  };

  const handleSpeak = async () => {
    if (textToSpeak.trim()) {
      await speak(textToSpeak, {
        rate: 0.9,
        pitch: 1.0,
      });
    }
  };

  const handleStop = async () => {
    await stop();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
      paddingBottom: insets.bottom + 20,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8,
    },
    cardDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
      minHeight: 100,
      textAlignVertical: 'top' as const,
    },
    voiceInputDisplay: {
      backgroundColor: colors.primaryLight,
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
    },
    voiceInputLabel: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: colors.primary,
      marginBottom: 8,
      textTransform: 'uppercase' as const,
    },
    voiceInputText: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.success + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: colors.success,
      marginLeft: 6,
    },
    featureList: {
      marginTop: 12,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    featureLabel: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
    featureValue: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: settings.voiceGuidance ? colors.success : colors.textLight,
    },
    centerContent: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 24,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Accessibility Test',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Accessibility Features</Text>
          <Text style={styles.subtitle}>
            Test voice input and text-to-speech capabilities
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Controls</Text>
          <AccessibilityControls showQuickToggle compact={false} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Speech-to-Text</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Voice Input</Text>
            <Text style={styles.cardDescription}>
              Tap the microphone button and speak. Your speech will be converted to text.
            </Text>

            <View style={styles.centerContent}>
              <VoiceInputButton
                onTranscriptionComplete={handleVoiceInput}
                size={64}
                variant="primary"
              />
            </View>

            {voiceInput && (
              <View style={styles.voiceInputDisplay}>
                <Text style={styles.voiceInputLabel}>Transcription</Text>
                <Text style={styles.voiceInputText}>{voiceInput}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Text-to-Speech</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Read Aloud</Text>
            <Text style={styles.cardDescription}>
              Enter text below and tap "Speak" to hear it read aloud.
            </Text>

            <TextInput
              style={styles.input}
              value={textToSpeak}
              onChangeText={setTextToSpeak}
              placeholder="Enter text to speak..."
              placeholderTextColor={colors.textLight}
              multiline
              accessibilityLabel="Text to speak"
            />

            <View style={styles.buttonRow}>
              <Button
                onPress={handleSpeak}
                disabled={!textToSpeak.trim() || isSpeaking}
                variant="primary"
                style={{ flex: 1 }}
              >
                <Volume2 size={18} color={colors.surface} />
                <Text style={{ color: colors.surface, marginLeft: 8, fontWeight: '600' as const }}>
                  {isSpeaking ? 'Speaking...' : 'Speak'}
                </Text>
              </Button>

              {isSpeaking && (
                <Button
                  onPress={handleStop}
                  variant="secondary"
                  style={{ flex: 1 }}
                >
                  <Text style={{ color: colors.text, fontWeight: '600' as const }}>Stop</Text>
                </Button>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Settings</Text>
          
          <View style={styles.card}>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Voice Guidance</Text>
                <Text style={styles.featureValue}>
                  {settings.voiceGuidance ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Screen Reader Optimized</Text>
                <Text style={styles.featureValue}>
                  {settings.screenReaderOptimized ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>High Contrast</Text>
                <Text style={styles.featureValue}>
                  {settings.highContrast ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Large Text</Text>
                <Text style={styles.featureValue}>
                  {settings.largeText ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Reduced Motion</Text>
                <Text style={styles.featureValue}>
                  {settings.reducedMotion ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Haptic Feedback</Text>
                <Text style={styles.featureValue}>
                  {settings.hapticFeedback ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
