import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Trophy, Star, Zap, Target } from 'lucide-react-native';
import colors from '@/constants/colors';

type AchievementType = 'first_task' | 'streak_7' | 'streak_30' | 'tasks_10' | 'tasks_50' | 'breathing_10';

type AchievementToastProps = {
  type: AchievementType;
  visible: boolean;
  onHide: () => void;
};

const ACHIEVEMENTS = {
  first_task: {
    icon: Star,
    title: 'First Task Complete!',
    subtitle: 'Great start on your journey',
    color: colors.success,
  },
  streak_7: {
    icon: Trophy,
    title: '7 Day Streak!',
    subtitle: 'You\'re building great habits',
    color: colors.warning,
  },
  streak_30: {
    icon: Trophy,
    title: '30 Day Streak!',
    subtitle: 'Incredible dedication!',
    color: colors.primary,
  },
  tasks_10: {
    icon: Target,
    title: '10 Tasks Completed!',
    subtitle: 'You\'re on a roll',
    color: colors.secondary,
  },
  tasks_50: {
    icon: Zap,
    title: '50 Tasks Completed!',
    subtitle: 'Productivity champion!',
    color: colors.accent,
  },
  breathing_10: {
    icon: Star,
    title: '10 Breathing Sessions!',
    subtitle: 'Mastering mindfulness',
    color: colors.decorative.mint,
  },
};

export function AchievementToast({ type, visible, onHide }: AchievementToastProps) {
  const translateY = React.useRef(new Animated.Value(-100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, translateY, opacity, onHide]);

  if (!visible) return null;

  const achievement = ACHIEVEMENTS[type];
  const IconComponent = achievement.icon;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: achievement.color }]}>
        <IconComponent size={24} color={colors.surface} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={styles.subtitle}>{achievement.subtitle}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
