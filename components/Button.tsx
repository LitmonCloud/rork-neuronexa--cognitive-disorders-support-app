import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fontSizes, fontWeights } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
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
}

export default function Button({
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
}: ButtonProps) {
  const { colors } = useTheme();
  
  const styles = useMemo(() => createStyles(colors), [colors]);

  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.buttonDisabled,
    fullWidth && styles.buttonFullWidth,
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
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      testID={testID}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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

  button_primary: {
    backgroundColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.secondary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  button_ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  button_danger: {
    backgroundColor: colors.error,
  },

  button_sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 36,
  },
  button_md: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  button_lg: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    minHeight: 52,
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
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
  text_ghost: {
    color: colors.primary,
    fontWeight: fontWeights.medium,
  },
  text_danger: {
    color: colors.surface,
    fontWeight: fontWeights.semibold,
  },

  text_sm: {
    fontSize: fontSizes.sm,
  },
  text_md: {
    fontSize: fontSizes.md,
  },
  text_lg: {
    fontSize: fontSizes.lg,
  },

  textDisabled: {
    opacity: 1,
  },
});
