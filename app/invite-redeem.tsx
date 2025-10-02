import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { CheckCircle, XCircle } from 'lucide-react-native';
import { useCaregivers } from '@/contexts/CaregiverContext';
import {
  formatInviteCode,
  validateInviteCodeFormat,
} from '@/utils/inviteCodeGenerator';
import colors from '@/constants/colors';

export default function InviteRedeemScreen() {
  const { redeemInvite } = useCaregivers();
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleCodeChange = (text: string) => {
    const formatted = formatInviteCode(text);
    setCode(formatted);
    setError('');
  };

  const handleRedeem = async () => {
    Keyboard.dismiss();

    if (!validateInviteCodeFormat(code)) {
      setError('Please enter a valid 8-character code');
      return;
    }

    setLoading(true);
    setError('');
    console.log('[InviteRedeem] Attempting to redeem code:', code);

    try {
      const caregiverId = `caregiver-${Date.now()}`;
      const result = await redeemInvite(code, caregiverId);

      if (result.success) {
        console.log('[InviteRedeem] Code redeemed successfully');
        Alert.alert(
          'Success!',
          'You are now connected as a caregiver. You can view the patient dashboard.',
          [
            {
              text: 'View Dashboard',
              onPress: () => router.replace('/caregiver-dashboard'),
            },
          ]
        );
      } else {
        console.error('[InviteRedeem] Failed to redeem:', result.error);
        
        let errorMessage = 'Failed to redeem invite code';
        if (result.error === 'Invalid invite code') {
          errorMessage = 'This code is not valid. Please check and try again.';
        } else if (result.error === 'This code has already been used') {
          errorMessage = 'This code has already been used. Please request a new one.';
        } else if (result.error === 'This code has expired') {
          errorMessage = 'This code has expired. Please request a new one from the patient.';
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error('[InviteRedeem] Error redeeming invite:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValidFormat = validateInviteCodeFormat(code);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen
        options={{
          title: 'Join as Caregiver',
          headerStyle: { backgroundColor: colors.background },
        }}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Enter Invite Code</Text>
          <Text style={styles.subtitle}>
            Enter the 8-character code provided by the patient to connect as
            their caregiver
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Invite Code</Text>
          <View
            style={[
              styles.inputWrapper,
              error && styles.inputWrapperError,
              isValidFormat && styles.inputWrapperValid,
            ]}
          >
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={handleCodeChange}
              placeholder="XXXX-XXXX"
              placeholderTextColor={colors.textLight}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={9}
              editable={!loading}
              accessibilityLabel="Invite code input"
              accessibilityHint="Enter the 8-character invite code"
            />
            {code.length > 0 && (
              <View style={styles.validationIcon}>
                {isValidFormat ? (
                  <CheckCircle size={24} color={colors.success} />
                ) : (
                  <XCircle size={24} color={colors.error} />
                )}
              </View>
            )}
          </View>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.redeemButton,
            (!isValidFormat || loading) && styles.redeemButtonDisabled,
          ]}
          onPress={handleRedeem}
          disabled={!isValidFormat || loading}
          accessibilityLabel="Redeem invite code"
          accessibilityRole="button"
          accessibilityState={{ disabled: !isValidFormat || loading }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.redeemButtonText}>Connect as Caregiver</Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Need help?</Text>
          <Text style={styles.infoText}>
            • Ask the patient to generate a new invite code
          </Text>
          <Text style={styles.infoText}>
            • Codes expire after 15 minutes
          </Text>
          <Text style={styles.infoText}>
            • Each code can only be used once
          </Text>
          <Text style={styles.infoText}>
            • Make sure you enter the code exactly as shown
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
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
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  inputWrapperValid: {
    borderColor: colors.success,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    padding: 16,
    letterSpacing: 2,
  },
  validationIcon: {
    paddingRight: 16,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 8,
  },
  redeemButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  redeemButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.5,
  },
  redeemButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: 'white',
  },
  infoBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
});
