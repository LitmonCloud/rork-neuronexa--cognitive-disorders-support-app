// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { trpc, trpcClient } from "@/lib/trpc";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TaskProvider } from "@/contexts/TaskContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { SubscriptionProvider, useSubscription } from "@/contexts/SubscriptionContext";
import { RetentionProvider } from "@/contexts/RetentionContext";
import { CaregiverProvider } from "@/contexts/CaregiverContext";
import { FunnelProvider } from "@/contexts/FunnelContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { posthog } from "@/services/analytics/PostHogService";
import { sentry } from "@/services/analytics/SentryService";
import { supabase } from "@/services/backend/SupabaseService";
import { pushNotifications } from "@/services/notifications/PushNotificationService";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const TERMS_ACCEPTED_KEY = '@neuronexa_terms_accepted';

function RootLayoutNav() {
  const { onboardingCompleted, isLoading } = useSubscription();
  const segments = useSegments();
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function checkTermsAcceptance() {
      try {
        const stored = await AsyncStorage.getItem(TERMS_ACCEPTED_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          setTermsAccepted(data.accepted === true);
        } else {
          setTermsAccepted(false);
        }
      } catch (error) {
        console.error('[RootLayout] Error checking terms acceptance:', error);
        setTermsAccepted(false);
      } finally {
        setIsInitialized(true);
      }
    }
    checkTermsAcceptance();
  }, []);

  useEffect(() => {
    if (!isInitialized || isLoading || termsAccepted === null) return;

    const inTermsAgreement = segments[0] === 'terms-agreement';
    const inOnboarding = segments[0] === 'onboarding';

    if (!termsAccepted && !inTermsAgreement) {
      router.replace('/terms-agreement');
    } else if (termsAccepted && !onboardingCompleted && !inOnboarding && !inTermsAgreement) {
      router.replace('/onboarding');
    } else if (termsAccepted && onboardingCompleted && (inOnboarding || inTermsAgreement)) {
      router.replace('/(tabs)');
    }
  }, [isInitialized, termsAccepted, onboardingCompleted, segments, isLoading, router]);

  if (!isInitialized || isLoading || termsAccepted === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F7FF' }}>
        <ActivityIndicator size="large" color="#6B7FD7" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="terms-agreement" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="paywall" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="task/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="caregiver-dashboard" options={{ headerShown: true, title: 'Caregiver Dashboard' }} />
      <Stack.Screen name="invite-generate" options={{ headerShown: true, title: 'Invite Caregiver' }} />
      <Stack.Screen name="invite-redeem" options={{ headerShown: true, title: 'Join as Caregiver' }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="notification-settings" options={{ headerShown: true, title: 'Notification Settings' }} />
      <Stack.Screen name="finger-trace" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    async function initializeServices() {
      console.log('[RootLayout] Initializing services...');
      
      sentry.initialize();
      await posthog.initialize();
      await supabase.initialize();
      await pushNotifications.initialize();
      
      console.log('[RootLayout] Services initialized');
      SplashScreen.hideAsync();
    }
    
    initializeServices();
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
                  <UserProfileProvider>
                    <CaregiverProvider>
                      <TaskProvider>
                        <GestureHandlerRootView>
                          <RootLayoutNav />
                        </GestureHandlerRootView>
                      </TaskProvider>
                    </CaregiverProvider>
                  </UserProfileProvider>
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
