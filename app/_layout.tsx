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
import { PatientProvider } from "@/contexts/PatientContext";
import { FunnelProvider } from "@/contexts/FunnelContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { DementiaProvider } from "@/contexts/DementiaContext";
import { posthog } from "@/services/analytics/PostHogService";
import { sentry } from "@/services/analytics/SentryService";
import { supabase } from "@/services/backend/SupabaseService";
import { pushNotifications } from "@/services/notifications/PushNotificationService";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const TERMS_ACCEPTED_KEY = '@neuronexa_terms_accepted';

function RootLayoutNav() {
  const { onboardingCompleted, isLoading } = useSubscription();
  const segments = useSegments();
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const checkTermsAcceptance = React.useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(TERMS_ACCEPTED_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        const accepted = data.accepted === true;
        console.log('[RootLayout] Terms acceptance status:', accepted);
        setTermsAccepted(accepted);
        return accepted;
      } else {
        console.log('[RootLayout] No terms acceptance found');
        setTermsAccepted(false);
        return false;
      }
    } catch (error) {
      console.error('[RootLayout] Error checking terms acceptance:', error);
      setTermsAccepted(false);
      return false;
    }
  }, []);

  useEffect(() => {
    async function initialize() {
      const timeout = setTimeout(() => {
        console.warn('[RootLayout] Terms check timeout, using default');
        setTermsAccepted(false);
        setIsInitialized(true);
      }, 3000);

      await checkTermsAcceptance();
      clearTimeout(timeout);
      setIsInitialized(true);
    }
    initialize();
  }, [checkTermsAcceptance]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (segments[0] === 'terms-agreement') {
        checkTermsAcceptance();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [segments, checkTermsAcceptance]);

  useEffect(() => {
    if (!isInitialized || isLoading || termsAccepted === null) return;

    const inTermsAgreement = segments[0] === 'terms-agreement';
    const inOnboarding = segments[0] === 'onboarding';
    const inTabs = segments[0] === '(tabs)';
    const inTask = segments[0] === 'task';
    const inPaywall = segments[0] === 'paywall';
    const inCaregiver = segments[0] === 'caregiver-dashboard' || segments[0] === 'caregiver-task-manager' || segments[0] === 'caregiver-patient-tasks' || segments[0] === 'invite-generate' || segments[0] === 'invite-redeem';
    const inNotifications = segments[0] === 'notifications' || segments[0] === 'notification-settings';
    const inFingerTrace = segments[0] === 'finger-trace';
    const inAllowedScreen = inTabs || inTask || inPaywall || inCaregiver || inNotifications || inFingerTrace;

    console.log('[RootLayout] Navigation check:', { termsAccepted, onboardingCompleted, inTermsAgreement, inOnboarding, inTabs, inTask, inAllowedScreen });

    if (!termsAccepted && !inTermsAgreement) {
      console.log('[RootLayout] Redirecting to terms-agreement');
      router.replace('/terms-agreement');
    } else if (termsAccepted && !onboardingCompleted && !inOnboarding) {
      console.log('[RootLayout] Redirecting to onboarding');
      router.replace('/onboarding');
    } else if (termsAccepted && onboardingCompleted && !inAllowedScreen) {
      console.log('[RootLayout] Redirecting to tabs');
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
      <Stack.Screen name="task/test-dummy" options={{ headerShown: false }} />
      <Stack.Screen name="caregiver-dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="caregiver-task-manager" options={{ headerShown: false }} />
      <Stack.Screen name="caregiver-patient-tasks" options={{ headerShown: false }} />
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
      
      const timeout = setTimeout(() => {
        console.log('[RootLayout] Service initialization timeout, hiding splash');
        SplashScreen.hideAsync();
      }, 5000);

      try {
        sentry.initialize();
        await Promise.race([
          Promise.all([
            posthog.initialize(),
            supabase.initialize(),
            pushNotifications.initialize(),
          ]),
          new Promise(resolve => setTimeout(resolve, 3000)),
        ]);
        
        clearTimeout(timeout);
        console.log('[RootLayout] Services initialized');
      } catch (error) {
        clearTimeout(timeout);
        console.error('[RootLayout] Service initialization error:', error);
      } finally {
        SplashScreen.hideAsync();
      }
    }
    
    initializeServices();
  }, []);

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
          <FunnelProvider>
            <SubscriptionProvider>
              <RetentionProvider>
                <AccessibilityProvider>
                  <NotificationProvider>
                    <UserProfileProvider>
                      <DementiaProvider>
                        <CaregiverProvider>
                          <PatientProvider>
                            <TaskProvider>
                              <GestureHandlerRootView style={{ flex: 1 }}>
                                <RootLayoutNav />
                              </GestureHandlerRootView>
                            </TaskProvider>
                          </PatientProvider>
                        </CaregiverProvider>
                      </DementiaProvider>
                    </UserProfileProvider>
                  </NotificationProvider>
                </AccessibilityProvider>
              </RetentionProvider>
            </SubscriptionProvider>
          </FunnelProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}
