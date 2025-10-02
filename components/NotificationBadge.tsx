import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationBadgeProps {
  size?: 'small' | 'medium' | 'large';
  showZero?: boolean;
  maxCount?: number;
}

export function NotificationBadge({ 
  size = 'medium', 
  showZero = false,
  maxCount = 99 
}: NotificationBadgeProps) {
  const { stats } = useNotifications();
  const count = stats.unread;

  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  const sizeStyle = styles[size];

  return (
    <View style={[styles.badge, sizeStyle]}>
      <Text style={[styles.text, styles[`${size}Text` as keyof typeof styles]]} numberOfLines={1}>
        {displayCount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
    paddingHorizontal: 6,
  },
  small: {
    height: 16,
    minWidth: 16,
    paddingHorizontal: 4,
  },
  medium: {
    height: 20,
    minWidth: 20,
    paddingHorizontal: 6,
  },
  large: {
    height: 24,
    minWidth: 24,
    paddingHorizontal: 8,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700' as const,
    textAlign: 'center' as const,
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});
