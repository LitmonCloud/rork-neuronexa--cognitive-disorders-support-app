import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useTheme } from "@/contexts/ThemeContext";

interface RoleGateProps {
  allow: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ allow, children, fallback }: RoleGateProps) {
  const { profile, isLoading } = useUserProfile();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: 16,
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
  });

  if (isLoading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  if (!allow.includes(profile.role || "")) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Redirect href="/(tabs)" />;
  }

  return <>{children}</>;
}
