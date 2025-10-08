import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  AccessibilityRole,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useHaptics } from '@/hooks/useHaptics';
import { fontSizes, fontWeights } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { applyColorBlindFilter } from '@/utils/colorBlindFilters';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface AccessibleButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
}

export default function AccessibleButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  testID,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
}: AccessibleButtonProps) {
  const { colors } = useTheme();
  const { settings } = useAccessibility();
  const haptics = useHaptics();

  const styles = useMemo(() => createStyles(colors, settings), [colors, settings]);

  const handlePress = () => {
    haptics.triggerLight();
    onPress();
  };

  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.buttonDisabled,
    fullWidth && styles.buttonFullWidth,
    settings.focusIndicators && styles.buttonFocusable,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? colors.surface : colors.primary}
          size="small"
        />
      );
    }

    return (
      <View style={styles.content}>
        {icon && iconPosition === 'left' && <View style={styles.iconLeft}><Text>{icon}</Text></View>}
        <Text style={textStyles}>{title}</Text>
        {icon && iconPosition === 'right' && <View style={styles.iconRight}><Text>{icon}</Text></View>}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
      accessible={true}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const createStyles = (
  colors: ReturnType<typeof useTheme>['colors'],
  settings: ReturnType<typeof useAccessibility>['settings']
) => {
  const textSizeMultiplier = settings.largeText ? 1.2 : 1;

  return StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.md,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: settings.reducedMotion ? 0 : 0.1,
      shadowRadius: 4,
      elevation: settings.reducedMotion ? 0 : 2,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconLeft: {
      marginRight: spacing.sm,
    },
    iconRight: {
      marginLeft: spacing.sm,
    },
    buttonFocusable: {
      borderWidth: 2,
      borderColor: 'transparent',
    },
    button_primary: {
      backgroundColor: applyColorBlindFilter(colors.primary, settings.colorBlindMode),
    },
    button_secondary: {
      backgroundColor: applyColorBlindFilter(colors.secondary, settings.colorBlindMode),
    },
    button_outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: applyColorBlindFilter(colors.primary, settings.colorBlindMode),
    },
    button_ghost: {
      backgroundColor: 'transparent',
      shadowOpacity: 0,
      elevation: 0,
    },
    button_danger: {
      backgroundColor: applyColorBlindFilter(colors.error, settings.colorBlindMode),
    },
    button_sm: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: 36 * textSizeMultiplier,
    },
    button_md: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      minHeight: 44 * textSizeMultiplier,
    },
    button_lg: {
      paddingHorizontal: spacing.xxl,
      paddingVertical: spacing.lg,
      minHeight: 52 * textSizeMultiplier,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonFullWidth: {
      width: '100%',
    },
    text: {
      textAlign: 'center' as const,
    },
    text_primary: {
      color: colors.surface,
      fontWeight: fontWeights.semibold,
    },
    text_secondary: {
      color: colors.surface,
      fontWeight: fontWeights.semibold,
    },
    text_outline: {
      color: applyColorBlindFilter(colors.primary, settings.colorBlindMode),
      fontWeight: fontWeights.semibold,
    },
    text_ghost: {
      color: applyColorBlindFilter(colors.primary, settings.colorBlindMode),
      fontWeight: fontWeights.medium,
    },
    text_danger: {
      color: colors.surface,
      fontWeight: fontWeights.semibold,
    },
    text_sm: {
      fontSize: fontSizes.sm * textSizeMultiplier,
    },
    text_md: {
      fontSize: fontSizes.md * textSizeMultiplier,
    },
    text_lg: {
      fontSize: fontSizes.lg * textSizeMultiplier,
    },
    textDisabled: {
      opacity: 1,
    },
  });
};
