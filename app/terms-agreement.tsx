import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { Check, FileText, Shield, ExternalLink } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TERMS_ACCEPTED_KEY = '@neuronexa_terms_accepted';

export default function TermsAgreementScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { updateProfile } = useUserProfile();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: '800' as const,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 12,
    },
    sectionText: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 8,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: colors.border,
    },
    checkboxContainerChecked: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      marginTop: 2,
    },
    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    checkboxText: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
    },
    link: {
      color: colors.primary,
      fontWeight: '600' as const,
    },
    linkContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: 20,
    },
    continueButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    continueButtonDisabled: {
      backgroundColor: colors.border,
      shadowOpacity: 0,
      elevation: 0,
    },
    continueButtonText: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.surface,
    },
    continueButtonTextDisabled: {
      color: colors.textSecondary,
    },
    disclaimer: {
      marginTop: 16,
      padding: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.warning,
    },
    disclaimerTitle: {
      fontSize: 14,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 8,
    },
    disclaimerText: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

  const handleAcceptTerms = () => {
    setAcceptedTerms(!acceptedTerms);
  };

  const handleAcceptPrivacy = () => {
    setAcceptedPrivacy(!acceptedPrivacy);
  };

  const handleContinue = async () => {
    if (!acceptedTerms || !acceptedPrivacy) return;

    try {
      const timestamp = new Date().toISOString();
      const version = '1.0.0';

      await AsyncStorage.setItem(TERMS_ACCEPTED_KEY, JSON.stringify({
        accepted: true,
        timestamp,
        version,
      }));

      updateProfile({
        termsAcceptedAt: timestamp,
        termsVersion: version,
      });

      console.log('[TermsAgreement] Terms accepted, proceeding to onboarding');
      router.replace('/onboarding');
    } catch (error) {
      console.error('[TermsAgreement] Error saving acceptance:', error);
    }
  };

  const openTerms = () => {
    Linking.openURL('https://neuronexa.app/legal/terms');
  };

  const openPrivacy = () => {
    Linking.openURL('https://neuronexa.app/legal/privacy');
  };

  const canContinue = acceptedTerms && acceptedPrivacy;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>Welcome to NeuroNexa</Text>
          <Text style={styles.subtitle}>
            Before we begin, please review and accept our terms
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Privacy Matters</Text>
          <Text style={styles.sectionText}>
            NeuroNexa is designed with your privacy in mind. All your data is stored locally on your device by default, and we never sell your personal information.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.checkboxContainer,
            acceptedTerms && styles.checkboxContainerChecked,
          ]}
          onPress={handleAcceptTerms}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms && <Check size={16} color={colors.surface} strokeWidth={3} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.checkboxText}>
              I have read and agree to the{' '}
              <Text style={styles.link} onPress={openTerms}>
                Terms of Service
              </Text>
            </Text>
            <TouchableOpacity onPress={openTerms} style={styles.linkContainer}>
              <FileText size={14} color={colors.primary} />
              <Text style={[styles.checkboxText, { fontSize: 13, color: colors.primary }]}>
                View Terms
              </Text>
              <ExternalLink size={12} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.checkboxContainer,
            acceptedPrivacy && styles.checkboxContainerChecked,
          ]}
          onPress={handleAcceptPrivacy}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, acceptedPrivacy && styles.checkboxChecked]}>
            {acceptedPrivacy && <Check size={16} color={colors.surface} strokeWidth={3} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.checkboxText}>
              I have read and agree to the{' '}
              <Text style={styles.link} onPress={openPrivacy}>
                Privacy Policy
              </Text>
            </Text>
            <TouchableOpacity onPress={openPrivacy} style={styles.linkContainer}>
              <Shield size={14} color={colors.primary} />
              <Text style={[styles.checkboxText, { fontSize: 13, color: colors.primary }]}>
                View Privacy Policy
              </Text>
              <ExternalLink size={12} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>Important Medical Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            NeuroNexa is NOT a medical device and does NOT provide medical advice, diagnosis, or treatment. It is a productivity and wellness tool. Always consult qualified healthcare professionals for medical concerns.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You're Agreeing To</Text>
          <Text style={styles.sectionText}>
            • We store your data locally on your device{'\n'}
            • We use AI to help break down tasks{'\n'}
            • You can delete your data at any time{'\n'}
            • We never sell your personal information{'\n'}
            • You must be 13+ to use this app
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !canContinue && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            !canContinue && styles.continueButtonTextDisabled,
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
