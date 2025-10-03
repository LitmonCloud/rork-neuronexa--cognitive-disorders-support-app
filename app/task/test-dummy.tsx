import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function TestDummyScreen() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '800' as const,
      textAlign: 'center',
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 16,
      marginTop: 12,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Navigation Works!</Text>
      <Text style={styles.subtitle}>
        If you see this screen, the router is functioning correctly.
      </Text>
    </View>
  );
}
