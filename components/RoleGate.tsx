import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Redirect } from "expo-router";
import { useUserProfile } from "@/contexts/UserProfileContext";

export function RoleGate({ allow, children }: { allow: string[]; children: React.ReactNode }) {
  const { profile, isLoading } = useUserProfile();

  if (isLoading || !profile) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0b0b0d", alignItems: "center", justifyContent: "center", gap: 12, padding: 16 }}>
        <ActivityIndicator size="large" color="#7b61ff" />
        <Text style={{ color: "#cfd0d9", fontSize: 16 }}>Loading…</Text>
      </View>
    );
  }

  if (!allow.includes(profile.role || "")) {
    return <Redirect href="/(tabs)/caregiver" />;
  }

  return <>{children}</>;
}
