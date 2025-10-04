import { Tabs, Redirect, useSegments } from "expo-router";
import { CheckSquare, Settings, TrendingUp, Heart, Sparkles, Brain } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useUserProfile } from "@/contexts/UserProfileContext";

function TabsSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0b0b0d", alignItems: "center", justifyContent: "center", gap: 12, padding: 16 }}>
      <ActivityIndicator size="large" color="#7b61ff" />
      <Text style={{ color: "#cfd0d9", fontSize: 16 }}>Loading profile…</Text>
    </View>
  );
}

export default function TabLayout() {
  const theme = useTheme();
  const { colors } = theme;
  const { profile, isLoading } = useUserProfile();
  const segments = useSegments() as string[];
  
  if (isLoading || !profile) {
    return <TabsSkeleton />;
  }
  
  const isCaregiver = profile?.role === 'caregiver';
  
  console.log('[TabLayout] Profile role:', profile?.role, 'isCaregiver:', isCaregiver);
  
  const PATIENT_TABS = new Set(["index", "coach", "progress", "wellness", "dementia-support", "settings"]);
  const CAREGIVER_TABS = new Set(["settings"]);
  
  const allowedTabs = isCaregiver ? CAREGIVER_TABS : PATIENT_TABS;
  const currentTab = segments[1];
  
  if (currentTab && !allowedTabs.has(currentTab)) {
    console.log('[TabLayout] Redirecting from', currentTab, 'to', isCaregiver ? '/caregiver-dashboard' : '/settings');
    return <Redirect href={isCaregiver ? "/caregiver-dashboard" : "/settings"} />;
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600' as const,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => <CheckSquare size={24} color={color} />,
          href: isCaregiver ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: "Nexa",
          tabBarIcon: ({ color }) => <Sparkles size={24} color={color} />,
          href: isCaregiver ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} />,
          href: isCaregiver ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="wellness"
        options={{
          title: "Wellness",
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
          href: isCaregiver ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="dementia-support"
        options={{
          title: "Memory",
          tabBarIcon: ({ color }) => <Brain size={24} color={color} />,
          href: isCaregiver ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
