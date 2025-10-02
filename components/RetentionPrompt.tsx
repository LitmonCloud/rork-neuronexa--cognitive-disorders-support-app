import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { X, ArrowRight, Heart, Sparkles, Users, Wind } from 'lucide-react-native';
import { RetentionTrigger } from '@/types/funnel';
import { router } from 'expo-router';
import colors from '@/constants/colors';

type RetentionPromptProps = {
  trigger: RetentionTrigger | null;
  onDismiss: () => void;
};

const ACTION_ICONS = {
  navigate_to_tasks: Heart,
  navigate_to_wellness: Wind,
  navigate_to_coach: Sparkles,
  navigate_to_caregiver: Users,
  show_value_proposition: Sparkles,
  show_whats_new: Sparkles,
  resume_onboarding: ArrowRight,
};

export function RetentionPrompt({ trigger, onDismiss }: RetentionPromptProps) {
  if (!trigger) return null;

  const handleAction = () => {
    switch (trigger.action) {
      case 'navigate_to_tasks':
        router.push('/(tabs)');
        break;
      case 'navigate_to_wellness':
        router.push('/(tabs)/wellness');
        break;
      case 'navigate_to_coach':
        router.push('/(tabs)/coach');
        break;
      case 'navigate_to_caregiver':
        router.push('/(tabs)/caregiver');
        break;
      case 'resume_onboarding':
        router.push('/onboarding');
        break;
      case 'show_value_proposition':
      case 'show_whats_new':
        break;
    }
    onDismiss();
  };

  const IconComponent = ACTION_ICONS[trigger.action as keyof typeof ACTION_ICONS] || Heart;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <IconComponent size={40} color={colors.primary} />
          </View>

          <Text style={styles.title}>
            {trigger.type === 'win_back' ? 'We Miss You!' : 'Quick Reminder'}
          </Text>

          <Text style={styles.message}>{trigger.message}</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
            <Text style={styles.actionButtonText}>Let&apos;s Go</Text>
            <ArrowRight size={20} color={colors.surface} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.surface,
  },
  dismissButton: {
    paddingVertical: 12,
  },
  dismissButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
});
