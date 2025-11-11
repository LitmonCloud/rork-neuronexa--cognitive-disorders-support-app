import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Volume2, VolumeX, Eye, EyeOff, Type, Zap } from 'lucide-react-native';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useHaptics } from '@/hooks/useHaptics';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

export interface AccessibilityControlsProps {
  showQuickToggle?: boolean;
  compact?: boolean;
}

export function AccessibilityControls({
  showQuickToggle = true,
  compact = false,
}: AccessibilityControlsProps) {
  const { settings, toggleSetting } = useAccessibility();
  const { colors } = useTheme();
  const { triggerHaptic } = useHaptics();
  useTextToSpeech();

  const handleToggle = async (setting: keyof typeof settings, label: string) => {
    triggerHaptic('light');
    toggleSetting(setting);
    
    const newValue = !settings[setting];
    const message = `${label} ${newValue ? 'enabled' : 'disabled'}`;
    console.log('[Accessibility]', message);
  };

  if (!showQuickToggle) {
    return null;
  }

  const iconSize = compact ? 18 : 20;
  const buttonSize = compact ? 36 : 44;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: compact ? 8 : 12,
      padding: compact ? 8 : 12,
      backgroundColor: colors.surface,
      borderRadius: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    button: {
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    activeButton: {
      backgroundColor: colors.primary + '20',
    },
    label: {
      fontSize: compact ? 11 : 12,
      color: colors.textSecondary,
      fontWeight: '600' as const,
      marginTop: 2,
    },
    controlGroup: {
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.controlGroup}>
        <TouchableOpacity
          style={[styles.button, settings.voiceGuidance && styles.activeButton]}
          onPress={() => handleToggle('voiceGuidance', 'Voice guidance')}
          accessibilityLabel="Toggle voice guidance"
          accessibilityRole="button"
          accessibilityState={{ checked: settings.voiceGuidance }}
        >
          {settings.voiceGuidance ? (
            <Volume2 size={iconSize} color={colors.primary} />
          ) : (
            <VolumeX size={iconSize} color={colors.textLight} />
          )}
        </TouchableOpacity>
        {!compact && <Text style={styles.label}>Voice</Text>}
      </View>

      <View style={styles.controlGroup}>
        <TouchableOpacity
          style={[styles.button, settings.highContrast && styles.activeButton]}
          onPress={() => handleToggle('highContrast', 'High contrast')}
          accessibilityLabel="Toggle high contrast"
          accessibilityRole="button"
          accessibilityState={{ checked: settings.highContrast }}
        >
          {settings.highContrast ? (
            <Eye size={iconSize} color={colors.primary} />
          ) : (
            <EyeOff size={iconSize} color={colors.textLight} />
          )}
        </TouchableOpacity>
        {!compact && <Text style={styles.label}>Contrast</Text>}
      </View>

      <View style={styles.controlGroup}>
        <TouchableOpacity
          style={[styles.button, settings.largeText && styles.activeButton]}
          onPress={() => handleToggle('largeText', 'Large text')}
          accessibilityLabel="Toggle large text"
          accessibilityRole="button"
          accessibilityState={{ checked: settings.largeText }}
        >
          <Type size={iconSize} color={settings.largeText ? colors.primary : colors.textLight} />
        </TouchableOpacity>
        {!compact && <Text style={styles.label}>Text Size</Text>}
      </View>

      <View style={styles.controlGroup}>
        <TouchableOpacity
          style={[styles.button, settings.reducedMotion && styles.activeButton]}
          onPress={() => handleToggle('reducedMotion', 'Reduced motion')}
          accessibilityLabel="Toggle reduced motion"
          accessibilityRole="button"
          accessibilityState={{ checked: settings.reducedMotion }}
        >
          <Zap size={iconSize} color={settings.reducedMotion ? colors.primary : colors.textLight} />
        </TouchableOpacity>
        {!compact && <Text style={styles.label}>Motion</Text>}
      </View>
    </View>
  );
}
