import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationBadge } from './NotificationBadge';

interface NotificationButtonProps {
  color?: string;
  size?: number;
}

export function NotificationButton({ color = '#000000', size = 24 }: NotificationButtonProps) {
  const router = useRouter();
  const { stats } = useNotifications();

  return (
    <TouchableOpacity
      onPress={() => router.push('/notifications')}
      style={styles.button}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Bell size={size} color={color} />
      {stats.unread > 0 && (
        <View style={styles.badgeContainer}>
          <NotificationBadge size="small" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'relative' as const,
    padding: 8,
  },
  badgeContainer: {
    position: 'absolute' as const,
    top: 4,
    right: 4,
  },
});
