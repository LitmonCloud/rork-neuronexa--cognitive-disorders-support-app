import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function CaregiverPatientTasksScreen() {
  const router = useRouter();
  const { profile, isLoading } = useUserProfile();
  const { colors } = useTheme();

  useEffect(() => {
    if (!isLoading && profile?.role === 'caregiver') {
      router.replace('/caregiver-hub');
    }
  }, [isLoading, profile, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, marginTop: 16 }}>Redirecting...</Text>
      </View>
    );
  }

  if (profile?.role !== 'caregiver') {
    return <Redirect href="/(tabs)" />;
  }

  return null;
}
