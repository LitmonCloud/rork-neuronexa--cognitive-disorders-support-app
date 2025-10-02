// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { trpc, trpcClient } from "@/lib/trpc";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TaskProvider } from "@/contexts/TaskContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { SubscriptionProvider, useSubscription } from "@/contexts/SubscriptionContext";
import { RetentionProvider } from "@/contexts/RetentionContext";
import { CaregiverProvider } from "@/contexts/CaregiverContext";
import { FunnelProvider } from "@/contexts/FunnelContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { onboardingCompleted, isLoading } = useSubscription();
  const { isLoading: themeLoading } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inOnboarding = segments[0] === 'onboarding';

    if (!onboardingCompleted && !inOnboarding) {
      router.replace('/onboarding');
    } else if (onboardingCompleted && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [onboardingCompleted, segments, isLoading, router]);

  if (themeLoading || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F7FF' }}>
        <ActivityIndicator size="large" color="#6B7FD7" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="paywall" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="task/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="caregiver-dashboard" options={{ headerShown: true, title: 'Caregiver Dashboard' }} />
      <Stack.Screen name="invite-generate" options={{ headerShown: true, title: 'Invite Caregiver' }} />
      <Stack.Screen name="invite-redeem" options={{ headerShown: true, title: 'Join as Caregiver' }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="notification-settings" options={{ headerShown: true, title: 'Notification Settings' }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
        <FunnelProvider>
          <SubscriptionProvider>
            <RetentionProvider>
              <AccessibilityProvider>
                <NotificationProvider>
                  <CaregiverProvider>
                    <TaskProvider>
                      <GestureHandlerRootView>
                        <RootLayoutNav />
                      </GestureHandlerRootView>
                    </TaskProvider>
                  </CaregiverProvider>
                </NotificationProvider>
              </AccessibilityProvider>
            </RetentionProvider>
          </SubscriptionProvider>
        </FunnelProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
