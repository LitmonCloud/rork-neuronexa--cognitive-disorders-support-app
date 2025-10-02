import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Flame, Trophy, Star } from 'lucide-react-native';
import colors from '@/constants/colors';

type StreakBannerProps = {
  streakDays: number;
  animated?: boolean;
};

export function StreakBanner({ streakDays, animated = true }: StreakBannerProps) {
  const scaleAnim = React.useRef(new Animated.Value(animated ? 0 : 1)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [animated, scaleAnim]);

  if (streakDays === 0) return null;

  const isMilestone = streakDays % 7 === 0;
  const IconComponent = isMilestone ? Trophy : Flame;
  const backgroundColor = isMilestone ? colors.warning : colors.primary;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: backgroundColor + '20', transform: [{ scale: scaleAnim }] }
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <IconComponent size={20} color={colors.surface} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>
          {isMilestone ? `${streakDays} Day Milestone!` : `${streakDays} Day Streak`}
        </Text>
        <Text style={styles.subtitle}>
          {isMilestone 
            ? 'Amazing consistency! Keep it up!' 
            : 'Keep the momentum going!'}
        </Text>
      </View>

      {isMilestone && (
        <View style={styles.stars}>
          <Star size={16} color={colors.warning} fill={colors.warning} />
          <Star size={16} color={colors.warning} fill={colors.warning} />
          <Star size={16} color={colors.warning} fill={colors.warning} />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
});
