import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export function useHaptics() {
  const { settings } = useAccessibility();

  const triggerLight = () => {
    if (Platform.OS === 'web' || !settings.hapticFeedback) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const triggerMedium = () => {
    if (Platform.OS === 'web' || !settings.hapticFeedback) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const triggerHeavy = () => {
    if (Platform.OS === 'web' || !settings.hapticFeedback) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const triggerSuccess = () => {
    if (Platform.OS === 'web' || !settings.hapticFeedback) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const triggerWarning = () => {
    if (Platform.OS === 'web' || !settings.hapticFeedback) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const triggerError = () => {
    if (Platform.OS === 'web' || !settings.hapticFeedback) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const triggerSelection = () => {
    if (Platform.OS === 'web' || !settings.hapticFeedback) return;
    Haptics.selectionAsync();
  };

  return {
    triggerLight,
    triggerMedium,
    triggerHeavy,
    triggerSuccess,
    triggerWarning,
    triggerError,
    triggerSelection,
  };
}
