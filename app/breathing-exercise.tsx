import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import BreathingExercise from '@/components/BreathingExercise';
import { breathingPatterns } from '@/constants/mentalHealthResources';

export default function BreathingExerciseScreen() {
  const { colors } = useTheme();
  const { recordInteraction } = useUserProfile();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const patternId = params.patternId as string;

  const pattern = breathingPatterns.find(p => p.id === patternId) || breathingPatterns[0];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: insets.top,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 12,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      flex: 1,
    },
    content: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
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
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pattern.name}</Text>
      </View>
      <View style={styles.content}>
        <BreathingExercise
          pattern={pattern}
          onComplete={() => {
            console.log('[Analytics] Breathing exercise completed:', pattern.name);
            recordInteraction('wellness_completed', 'positive', { 
              exerciseType: 'breathing',
              patternId: pattern.id,
              patternName: pattern.name,
            });
            setTimeout(() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(tabs)/wellness');
              }
            }, 1500);
          }}
        />
      </View>
    </View>
  );
}
