// template
import { Tabs } from "expo-router";
import { CheckSquare, Settings, TrendingUp, Users, Heart, Sparkles } from "lucide-react-native";
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function TabLayout() {
  const theme = useTheme();
  const { colors } = theme;
  
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
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: "Nexa",
          tabBarIcon: ({ color }) => <Sparkles size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wellness"
        options={{
          title: "Wellness",
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="caregiver"
        options={{
          title: "Caregiver",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
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
