import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Copy, Share2, RefreshCw, ArrowLeft } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useCaregivers } from '@/contexts/CaregiverContext';
import {
  generateInviteCode,
  getExpirationTime,
  getRemainingTime,
  formatRemainingTime,
} from '@/utils/inviteCodeGenerator';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/contexts/ThemeContext';

interface PatientConnectionCode {
  id: string;
  code: string;
  patientId: string;
  patientName: string;
  expiresAt: Date;
  createdAt: Date;
  redeemedAt?: Date;
  redeemedBy?: string;
}

export default function PatientGenerateCodeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { profile } = useUserProfile();
  const { generateInvite } = useCaregivers();
  const [loading, setLoading] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [code, setCode] = useState<string>('');
  const [connectionCode, setConnectionCode] = useState<PatientConnectionCode | null>(null);

  const handleGenerateCode = useCallback(async () => {
    setLoading(true);
    console.log('[PatientGenerateCode] Generating new connection code');

    try {
      const newCode = generateInviteCode();
      const expiresAt = getExpirationTime();

      const newConnectionCode: PatientConnectionCode = {
        id: Date.now().toString(),
        code: newCode,
        patientId: profile?.userId || 'unknown',
        patientName: profile?.name || 'Patient',
        expiresAt,
        createdAt: new Date(),
      };

      const result = await generateInvite(newCode, expiresAt);
      
      if (!result.success) {
        console.error('[PatientGenerateCode] Failed to save invite:', result.error);
        Alert.alert('Error', 'Failed to generate connection code. Please try again.');
        return;
      }

      setConnectionCode(newConnectionCode);
      setCode(newCode);
      setRemainingTime(getRemainingTime(expiresAt));
      console.log('[PatientGenerateCode] Code generated and saved successfully:', newCode);
    } catch (error) {
      console.error('[PatientGenerateCode] Error generating code:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [profile?.userId, profile?.name, generateInvite]);

  useEffect(() => {
    if (!code) {
      handleGenerateCode();
    }
  }, [code, handleGenerateCode]);

  useEffect(() => {
    if (remainingTime <= 0) return;

    const interval = setInterval(() => {
      const newRemaining = connectionCode
        ? getRemainingTime(connectionCode.expiresAt)
        : 0;
      setRemainingTime(newRemaining);

      if (newRemaining <= 0) {
        Alert.alert(
          'Code Expired',
          'This connection code has expired. Please generate a new one.',
          [{ text: 'Generate New Code', onPress: handleGenerateCode }]
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime, connectionCode, handleGenerateCode]);



  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(code);
    Alert.alert('Copied', 'Connection code copied to clipboard');
    console.log('[PatientGenerateCode] Code copied to clipboard');
  };

  const handleShare = async () => {
    try {
      const message = `Connect with me on Nexa as my caregiver!\n\nConnection Code: ${code}\n\nThis code expires in ${formatRemainingTime(remainingTime)}.\n\nOpen the Nexa app and enter this code in the Caregiver Dashboard.`;

      if (Platform.OS === 'web') {
        if (navigator.share && navigator.canShare && navigator.canShare({ text: message })) {
          await navigator.share({
            title: 'Nexa Patient Connection',
            text: message,
          });
          console.log('[PatientGenerateCode] Share sheet opened (web)');
        } else {
          await Clipboard.setStringAsync(message);
          Alert.alert('Copied', 'Connection details copied to clipboard. Share API is not available in this browser.');
          console.log('[PatientGenerateCode] Fallback: copied to clipboard (web)');
        }
      } else {
        await Share.share({
          message,
          title: 'Nexa Patient Connection',
        });
        console.log('[PatientGenerateCode] Share sheet opened');
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        console.log('[PatientGenerateCode] Share cancelled by user');
        return;
      }
      console.error('[PatientGenerateCode] Error sharing:', error);
      await Clipboard.setStringAsync(`Connect with me on Nexa as my caregiver!\n\nConnection Code: ${code}\n\nThis code expires in ${formatRemainingTime(remainingTime)}.\n\nOpen the Nexa app and enter this code in the Caregiver Dashboard.`);
      Alert.alert('Copied', 'Could not open share dialog. Connection details copied to clipboard instead.');
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
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      flex: 1,
    },
    content: {
      padding: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.textSecondary,
    },
    introSection: {
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
      lineHeight: 22,
    },
    timerContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      marginBottom: 24,
      borderWidth: 2,
      borderColor: colors.border,
    },
    timerLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    timerValue: {
      fontSize: 36,
      fontWeight: '700' as const,
      color: colors.primary,
    },
    timerWarning: {
      color: colors.error,
    },
    qrContainer: {
      alignItems: 'center',
      marginBottom: 24,
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 12,
    },
    qrPlaceholder: {
      width: 200,
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 8,
    },
    qrPlaceholderText: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.textSecondary,
    },
    qrPlaceholderSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    codeContainer: {
      marginBottom: 20,
    },
    codeLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    codeBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    codeText: {
      flex: 1,
      fontSize: 24,
      fontWeight: '700' as const,
      color: colors.text,
      letterSpacing: 2,
    },
    copyButton: {
      padding: 8,
    },
    actions: {
      gap: 12,
      marginBottom: 24,
    },
    shareButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      gap: 8,
    },
    shareButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: 'white',
    },
    regenerateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    regenerateButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.primary,
    },
    infoBox: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
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

  if (!code || (loading && !code)) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Generating connection code...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)');
            }
          }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connect Caregiver</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.introSection}>
          <Text style={styles.title}>Share Your Code</Text>
          <Text style={styles.subtitle}>
            Share this code with your caregiver so they can connect to your account and help manage your tasks
          </Text>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Expires in</Text>
          <Text
            style={[
              styles.timerValue,
              remainingTime < 60000 && styles.timerWarning,
            ]}
            accessibilityLabel={`Code expires in ${formatRemainingTime(remainingTime)}`}
          >
            {formatRemainingTime(remainingTime)}
          </Text>
        </View>

        <View style={styles.qrContainer}>
          {Platform.OS !== 'web' && code && code.trim().length > 0 ? (
            <QRCode value={code} size={200} backgroundColor="white" />
          ) : (
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrPlaceholderText}>QR Code</Text>
              <Text style={styles.qrPlaceholderSubtext}>
                {Platform.OS === 'web' ? '(Not available on web)' : code ? 'Generating...' : 'Loading...'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Connection Code</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText} accessibilityLabel={`Connection code: ${code}`}>
              {code}
            </Text>
            <TouchableOpacity
              onPress={handleCopyCode}
              style={styles.copyButton}
              accessibilityLabel="Copy connection code"
              accessibilityRole="button"
            >
              <Copy size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            accessibilityLabel="Share connection code"
            accessibilityRole="button"
          >
            <Share2 size={20} color="white" />
            <Text style={styles.shareButtonText}>Share Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.regenerateButton}
            onPress={handleGenerateCode}
            accessibilityLabel="Generate new code"
            accessibilityRole="button"
          >
            <RefreshCw size={20} color={colors.primary} />
            <Text style={styles.regenerateButtonText}>Generate New Code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            1. Share the code or QR code with your caregiver
          </Text>
          <Text style={styles.infoText}>
            2. They open the Nexa app and go to Caregiver Dashboard
          </Text>
          <Text style={styles.infoText}>
            3. They enter your code in the &quot;Enter Code&quot; field
          </Text>
          <Text style={styles.infoText}>
            4. Once verified, they&apos;ll be able to help manage your tasks
          </Text>
          <Text style={styles.infoText}>
            5. Code expires in 15 minutes and can only be used once
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
