import React, { useState, useEffect } from 'react';
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
import { Copy, Share2, RefreshCw } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { useCaregivers } from '@/contexts/CaregiverContext';
import {
  generateInviteCode,
  generateDeepLink,
  getExpirationTime,
  getRemainingTime,
  formatRemainingTime,
} from '@/utils/inviteCodeGenerator';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/contexts/ThemeContext';

export default function InviteGenerateScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { generateInvite, activeInvite } = useCaregivers();
  const [loading, setLoading] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [code, setCode] = useState<string>('');
  const [deepLink, setDeepLink] = useState<string>('');

  useEffect(() => {
    if (activeInvite) {
      setCode(activeInvite.code);
      setDeepLink(generateDeepLink(activeInvite.code));
      setRemainingTime(getRemainingTime(activeInvite.expiresAt));
    } else {
      handleGenerateInvite();
    }
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) return;

    const interval = setInterval(() => {
      const newRemaining = activeInvite
        ? getRemainingTime(activeInvite.expiresAt)
        : 0;
      setRemainingTime(newRemaining);

      if (newRemaining <= 0) {
        Alert.alert(
          'Code Expired',
          'This invite code has expired. Please generate a new one.',
          [{ text: 'Generate New Code', onPress: handleGenerateInvite }]
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime, activeInvite]);

  const handleGenerateInvite = async () => {
    setLoading(true);
    console.log('[InviteGenerate] Generating new invite code');

    try {
      const newCode = generateInviteCode();
      const expiresAt = getExpirationTime();

      const result = await generateInvite(newCode, expiresAt);

      if (result.success && result.invite) {
        setCode(result.invite.code);
        setDeepLink(generateDeepLink(result.invite.code));
        setRemainingTime(getRemainingTime(result.invite.expiresAt));
        console.log('[InviteGenerate] Invite generated successfully:', newCode);
      } else {
        Alert.alert('Error', result.error || 'Failed to generate invite code');
        console.error('[InviteGenerate] Failed to generate invite:', result.error);
      }
    } catch (error) {
      console.error('[InviteGenerate] Error generating invite:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(code);
    Alert.alert('Copied', 'Invite code copied to clipboard');
    console.log('[InviteGenerate] Code copied to clipboard');
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(deepLink);
    Alert.alert('Copied', 'Invite link copied to clipboard');
    console.log('[InviteGenerate] Link copied to clipboard');
  };

  const handleShare = async () => {
    try {
      const message = `Join me on Nexa as my caregiver!\n\nInvite Code: ${code}\n\nOr tap this link: ${deepLink}\n\nThis code expires in ${formatRemainingTime(remainingTime)}.`;

      if (Platform.OS === 'web') {
        if (navigator.share && navigator.canShare && navigator.canShare({ text: message })) {
          await navigator.share({
            title: 'Nexa Caregiver Invite',
            text: message,
          });
          console.log('[InviteGenerate] Share sheet opened (web)');
        } else {
          await Clipboard.setStringAsync(message);
          Alert.alert('Copied', 'Invite details copied to clipboard. Share API is not available in this browser.');
          console.log('[InviteGenerate] Fallback: copied to clipboard (web)');
        }
      } else {
        await Share.share({
          message,
          title: 'Nexa Caregiver Invite',
        });
        console.log('[InviteGenerate] Share sheet opened');
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        console.log('[InviteGenerate] Share cancelled by user');
        return;
      }
      console.error('[InviteGenerate] Error sharing:', error);
      await Clipboard.setStringAsync(`Join me on Nexa as my caregiver!\n\nInvite Code: ${code}\n\nOr tap this link: ${deepLink}\n\nThis code expires in ${formatRemainingTime(remainingTime)}.`);
      Alert.alert('Copied', 'Could not open share dialog. Invite details copied to clipboard instead.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    linkContainer: {
      marginBottom: 24,
    },
    linkLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    linkBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    linkText: {
      flex: 1,
      fontSize: 12,
      color: colors.textSecondary,
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen
          options={{
            title: 'Invite Caregiver',
            headerBackVisible: true,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace('/caregiver-dashboard');
                  }
                }}
                style={{ marginLeft: 8, padding: 8 }}
              >
                <Text style={{ color: colors.primary, fontSize: 16 }}>Back</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Generating invite code...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: 'Invite Caregiver',
          headerStyle: { backgroundColor: colors.background },
          headerBackVisible: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/caregiver-dashboard');
                }
              }}
              style={{ marginLeft: 8, padding: 8 }}
            >
              <Text style={{ color: colors.primary, fontSize: 16 }}>Back</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Caregiver Invite</Text>
        <Text style={styles.subtitle}>
          Share this code with your caregiver to grant them access to your
          dashboard
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
        {Platform.OS !== 'web' ? (
          <QRCode value={deepLink} size={200} backgroundColor="white" />
        ) : (
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrPlaceholderText}>QR Code</Text>
            <Text style={styles.qrPlaceholderSubtext}>
              (Not available on web)
            </Text>
          </View>
        )}
      </View>

      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Invite Code</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText} accessibilityLabel={`Invite code: ${code}`}>
            {code}
          </Text>
          <TouchableOpacity
            onPress={handleCopyCode}
            style={styles.copyButton}
            accessibilityLabel="Copy invite code"
            accessibilityRole="button"
          >
            <Copy size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.linkContainer}>
        <Text style={styles.linkLabel}>Deep Link</Text>
        <View style={styles.linkBox}>
          <Text style={styles.linkText} numberOfLines={1}>
            {deepLink}
          </Text>
          <TouchableOpacity
            onPress={handleCopyLink}
            style={styles.copyButton}
            accessibilityLabel="Copy invite link"
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
          accessibilityLabel="Share invite"
          accessibilityRole="button"
        >
          <Share2 size={20} color="white" />
          <Text style={styles.shareButtonText}>Share Invite</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.regenerateButton}
          onPress={handleGenerateInvite}
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
          2. They enter the code in the Nexa app
        </Text>
        <Text style={styles.infoText}>
          3. Once verified, they&apos;ll have access to your dashboard
        </Text>
        <Text style={styles.infoText}>
          4. Code expires in 15 minutes and can only be used once
        </Text>
      </View>
    </ScrollView>
  );
}
