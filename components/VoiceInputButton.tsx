import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { Mic, MicOff } from 'lucide-react-native';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useTheme } from '@/contexts/ThemeContext';
import { useHaptics } from '@/hooks/useHaptics';

export interface VoiceInputButtonProps {
  onTranscriptionComplete: (text: string) => void;
  language?: string;
  size?: number;
  variant?: 'primary' | 'secondary' | 'minimal';
  disabled?: boolean;
}

export function VoiceInputButton({
  onTranscriptionComplete,
  language,
  size = 48,
  variant = 'primary',
  disabled = false,
}: VoiceInputButtonProps) {
  const { colors } = useTheme();
  const { triggerHaptic } = useHaptics();

  const {
    isRecording,
    isTranscribing,
    error,
    startRecording,
    stopRecording,
    hasPermission,
    requestPermission,
  } = useSpeechToText({
    language,
    onTranscriptionComplete: (result) => {
      onTranscriptionComplete(result.text);
      triggerHaptic('success');
    },
    onError: (err) => {
      console.error('[VoiceInputButton] Error:', err);
      triggerHaptic('error');
    },
  });

  const handlePress = useCallback(async () => {
    if (disabled) return;

    triggerHaptic('light');

    if (!hasPermission) {
      await requestPermission();
      return;
    }

    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }, [disabled, hasPermission, isRecording, requestPermission, startRecording, stopRecording, triggerHaptic]);

  const getBackgroundColor = () => {
    if (disabled) return colors.borderLight;
    if (isRecording) return colors.error;
    if (variant === 'primary') return colors.primary;
    if (variant === 'secondary') return colors.secondary;
    return colors.surface;
  };

  const getIconColor = () => {
    if (disabled) return colors.textLight;
    if (variant === 'minimal') return colors.primary;
    return colors.surface;
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: getBackgroundColor(),
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: variant === 'minimal' ? 2 : 0,
      borderColor: variant === 'minimal' ? colors.primary : 'transparent',
    },
    pulseRing: {
      position: 'absolute',
      width: size + 8,
      height: size + 8,
      borderRadius: (size + 8) / 2,
      borderWidth: 2,
      borderColor: colors.error,
      opacity: 0.3,
    },
    statusText: {
      marginTop: 8,
      fontSize: 12,
      fontWeight: '600' as const,
      color: isRecording ? colors.error : colors.textSecondary,
    },
    errorText: {
      marginTop: 4,
      fontSize: 11,
      color: colors.error,
      textAlign: 'center' as const,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        disabled={disabled || isTranscribing}
        activeOpacity={0.8}
        accessibilityLabel={
          isRecording
            ? 'Stop recording'
            : isTranscribing
            ? 'Processing speech'
            : 'Start voice input'
        }
        accessibilityRole="button"
        accessibilityState={{
          disabled: disabled || isTranscribing,
          busy: isTranscribing,
        }}
      >
        {isRecording && <View style={styles.pulseRing} />}
        
        {isTranscribing ? (
          <ActivityIndicator size="small" color={getIconColor()} />
        ) : isRecording ? (
          <MicOff size={size * 0.5} color={getIconColor()} />
        ) : (
          <Mic size={size * 0.5} color={getIconColor()} />
        )}
      </TouchableOpacity>
      
      {(isRecording || isTranscribing) && (
        <Text style={styles.statusText}>
          {isRecording ? 'Listening...' : 'Processing...'}
        </Text>
      )}
      
      {error && (
        <Text style={styles.errorText} numberOfLines={2}>
          {error.message}
        </Text>
      )}
    </View>
  );
}
