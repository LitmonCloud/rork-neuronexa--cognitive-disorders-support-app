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
import { UserProfileProvider, useUserProfile } from "@/contexts/UserProfileContext";
import { DementiaProvider } from "@/contexts/DementiaContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { RecommendationProvider } from "@/contexts/RecommendationContext";
import { PhotoMemoryContext } from "@/contexts/PhotoMemoryContext";
import { posthog } from "@/services/analytics/PostHogService";
import { sentry } from "@/services/analytics/SentryService";
import { supabase } from "@/services/backend/SupabaseService";
import { pushNotifications } from "@/services/notifications/PushNotificationService";
import { realtimeNotificationService } from "@/services/notifications/RealtimeNotificationService";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RealtimeNotificationListener } from "@/components/RealtimeNotificationListener";
import { logger } from "@/utils/logger";

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

const TERMS_ACCEPTED_KEY = '@nexa_terms_accepted';

function RootLayoutNav() {
  const { isLoading: subscriptionLoading, requiresSubscription } = useSubscription();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const segments = useSegments();
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const isLoading = subscriptionLoading || profileLoading;
  const onboardingCompleted = profile?.onboardingCompleted ?? false;
  const isCaregiver = profile?.role === 'caregiver';

  const checkTermsAcceptance = React.useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(TERMS_ACCEPTED_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        const accepted = data.accepted === true;
        logger.info('Terms acceptance status', { accepted });
        setTermsAccepted(accepted);
        return accepted;
      } else {
        logger.info('No terms acceptance found');
        setTermsAccepted(false);
        return false;
      }
    } catch (error) {
      logger.error('Error checking terms acceptance', error as Error);
      setTermsAccepted(false);
      return false;
    }
  }, []);

  useEffect(() => {
    async function initialize() {
      const timeout = setTimeout(() => {
        logger.warn('Terms check timeout, using default');
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

    const currentRoute = segments[0];
    const publicRoutes = ['terms-agreement', 'onboarding', 'paywall'];
    const caregiverRoutes = ['caregiver-dashboard', 'caregiver-hub', 'caregiver-task-manager', 'caregiver-patient-tasks', 'caregiver-location-monitor'];
    const sharedRoutes = ['(tabs)', 'task', 'notifications', 'notification-settings', 'finger-trace', 'emergency-contacts', 'memory-journal', 'invite-generate', 'invite-redeem', 'patient-generate-code', 'patient-location'];
    
    const isPublicRoute = publicRoutes.includes(currentRoute);
    const isCaregiverRoute = caregiverRoutes.includes(currentRoute);
    const isSharedRoute = sharedRoutes.includes(currentRoute);

    logger.debug('Navigation check', { 
      currentRoute, 
      termsAccepted, 
      onboardingCompleted, 
      isCaregiver, 
      requiresSubscription,
      isPublicRoute,
      isCaregiverRoute,
      isSharedRoute
    });

    if (!termsAccepted && currentRoute !== 'terms-agreement') {
      logger.info('Navigating to terms-agreement');
      router.replace('/terms-agreement');
      return;
    }

    if (termsAccepted && !onboardingCompleted && currentRoute !== 'onboarding') {
      logger.info('Navigating to onboarding');
      router.replace('/onboarding');
      return;
    }

    if (termsAccepted && onboardingCompleted && isCaregiver && requiresSubscription && currentRoute !== 'paywall') {
      logger.info('Navigating to paywall', { reason: 'caregiver needs subscription' });
      router.replace('/paywall');
      return;
    }

    if (termsAccepted && onboardingCompleted && !requiresSubscription) {
      if (!isCaregiver && isCaregiverRoute) {
        logger.info('Patient blocked from caregiver route, redirecting to tabs');
        router.replace('/(tabs)');
        return;
      }

      if (!isPublicRoute && !isCaregiverRoute && !isSharedRoute && !currentRoute) {
        logger.info('Navigating to default route', { isCaregiver });
        router.replace(isCaregiver ? '/caregiver-dashboard' : '/(tabs)');
        return;
      }
    }
  }, [isInitialized, termsAccepted, onboardingCompleted, isCaregiver, requiresSubscription, segments, isLoading, router]);

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
      <Stack.Screen name="caregiver-hub" options={{ headerShown: false }} />
      <Stack.Screen name="caregiver-task-manager" options={{ headerShown: false }} />
      <Stack.Screen name="caregiver-patient-tasks" options={{ headerShown: false }} />
      <Stack.Screen name="invite-generate" options={{ headerShown: true, title: 'Invite Caregiver' }} />
      <Stack.Screen name="invite-redeem" options={{ headerShown: true, title: 'Join as Caregiver' }} />
      <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Notifications' }} />
      <Stack.Screen name="notification-settings" options={{ headerShown: true, title: 'Notification Settings' }} />
      <Stack.Screen name="finger-trace" options={{ headerShown: false }} />
      <Stack.Screen name="breathing-exercise" options={{ headerShown: false }} />
      <Stack.Screen name="emergency-contacts" options={{ headerShown: true, title: 'Emergency Contacts' }} />
      <Stack.Screen name="memory-journal" options={{ headerShown: true, title: 'Memory Journal' }} />
      <Stack.Screen name="patient-generate-code" options={{ headerShown: false }} />
      <Stack.Screen name="patient-location" options={{ headerShown: true, title: 'Location Tracking' }} />
      <Stack.Screen name="caregiver-location-monitor" options={{ headerShown: true, title: 'Patient Locations' }} />
      <Stack.Screen name="recommendations" options={{ headerShown: false }} />
      <Stack.Screen name="memory-exercise" options={{ headerShown: false }} />
      <Stack.Screen name="paywall-revenuecat" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="customer-center" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    async function initializeServices() {
      logger.info('Initializing services...');
      
      try {
        sentry.initialize();
        
        await Promise.race([
          Promise.allSettled([
            posthog.initialize().catch(e => logger.info('PostHog init skipped', { message: e.message })),
            supabase.initialize().catch(e => logger.info('Supabase init skipped', { message: e.message })),
            pushNotifications.initialize().catch(e => logger.info('Push init skipped', { message: e.message })),
            realtimeNotificationService.initialize().catch(e => logger.info('Realtime init skipped', { message: e.message })),
          ]),
          new Promise(resolve => setTimeout(resolve, 2000)),
        ]);
        
        logger.info('Services initialized');
      } catch (error) {
        logger.error('Service initialization error', error as Error);
      } finally {
        await SplashScreen.hideAsync();
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
                        <LocationProvider>
                          <CaregiverProvider>
                            <PatientProvider>
                              <TaskProvider>
                                <RecommendationProvider>
                                  <PhotoMemoryContext>
                                    <GestureHandlerRootView style={{ flex: 1 }}>
                                      <RealtimeNotificationListener />
                                      <RootLayoutNav />
                                    </GestureHandlerRootView>
                                  </PhotoMemoryContext>
                                </RecommendationProvider>
                              </TaskProvider>
                            </PatientProvider>
                          </CaregiverProvider>
                        </LocationProvider>
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
