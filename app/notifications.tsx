import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NotificationCenter } from '@/components/NotificationCenter';
import { useTheme } from '@/contexts/ThemeContext';

export default function NotificationsScreen() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

  return (
    <View style={styles.container}>
      <NotificationCenter />
    </View>
  );
}
