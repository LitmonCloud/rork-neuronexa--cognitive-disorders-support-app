import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useFunnel } from '@/contexts/FunnelContext';
import { useTheme, lightColors } from '@/contexts/ThemeContext';
import { Brain, Heart, Users, Sparkles, ChevronRight, Check } from 'lucide-react-native';

interface OnboardingSlide {
  id: number;
  icon: typeof Brain;
  title: string;
  description: string;
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    icon: Brain,
    title: 'Built for Your Brain',
    description: 'AI-powered task breakdown designed specifically for ADHD, Autism, and cognitive challenges. Break overwhelming tasks into simple, manageable steps.',
    color: lightColors.decorative.lavender,
  },
  {
    id: 2,
    icon: Heart,
    title: 'Wellness First',
    description: 'Integrated breathing exercises, mental health resources, and progress tracking. Your wellbeing is at the center of everything we do.',
    color: lightColors.decorative.mint,
  },
  {
    id: 3,
    icon: Users,
    title: 'Caregiver Support',
    description: 'Share tasks and progress with caregivers, therapists, or family members. Get the support you need, when you need it.',
    color: lightColors.decorative.peach,
  },
  {
    id: 4,
    icon: Sparkles,
    title: 'Start Your Journey',
    description: 'Join thousands who are accomplishing more with less stress. Your 7-day premium trial starts now.',
    color: lightColors.primary,
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { completeOnboarding } = useSubscription();
  const { trackStep } = useFunnel();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 10,
      alignItems: 'flex-end',
    },
    skipButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    skipText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '600' as const,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    iconContainer: {
      width: 140,
      height: 140,
      borderRadius: 70,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 48,
    },
    textContainer: {
      alignItems: 'center',
      marginBottom: 48,
    },
    title: {
      fontSize: 32,
      fontWeight: '800' as const,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 16,
      letterSpacing: -0.5,
    },
    description: {
      fontSize: 17,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 26,
      paddingHorizontal: 8,
    },
    pagination: {
      flexDirection: 'row',
      gap: 8,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
    },
    paginationDotActive: {
      width: 32,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    nextButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 18,
      borderRadius: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    nextButtonText: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.surface,
    },
  });

  useEffect(() => {
    trackStep('onboarding_start');
  }, [trackStep]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [currentIndex, slideAnim]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      slideAnim.setValue(0);
      
      if (currentIndex === 0) trackStep('onboarding_profile');
      if (currentIndex === 1) trackStep('onboarding_goals');
      if (currentIndex === 2) trackStep('onboarding_preferences');
    } else {
      trackStep('onboarding_complete');
      completeOnboarding();
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const currentSlide = slides[currentIndex];
  const IconComponent = currentSlide.icon;

  const slideTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const slideOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.iconContainer,
            { 
              backgroundColor: currentSlide.color + '20',
              transform: [{ translateY: slideTranslateY }],
              opacity: slideOpacity,
            }
          ]}
        >
          <IconComponent size={64} color={currentSlide.color} />
        </Animated.View>

        <Animated.View 
          style={[
            styles.textContainer,
            {
              transform: [{ translateY: slideTranslateY }],
              opacity: slideOpacity,
            }
          ]}
        >
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.description}>{currentSlide.description}</Text>
        </Animated.View>

        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
                index === currentIndex && { backgroundColor: currentSlide.color },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: currentSlide.color }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          {currentIndex === slides.length - 1 ? (
            <>
              <Check size={24} color={colors.surface} />
              <Text style={styles.nextButtonText}>Get Started</Text>
            </>
          ) : (
            <>
              <Text style={styles.nextButtonText}>Continue</Text>
              <ChevronRight size={24} color={colors.surface} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
