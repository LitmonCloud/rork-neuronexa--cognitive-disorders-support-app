import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Bell, Volume2, Vibrate, Moon, Smartphone } from 'lucide-react-native';
import { useNotifications } from '@/contexts/NotificationContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { preferences, updatePreferences, enablePushNotifications } = useNotifications();

  const handleEnablePushNotifications = async () => {
    const token = await enablePushNotifications();
    if (!token) {
      alert('Failed to enable push notifications. Please check your device settings.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{ 
          title: 'Notification Settings',
          headerShown: true,
        }} 
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Bell size={20} color="#007AFF" />
              <Text style={styles.settingLabel}>Enable Notifications</Text>
            </View>
            <Switch
              value={preferences.enabled}
              onValueChange={(value) => updatePreferences({ enabled: value })}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Smartphone size={20} color="#007AFF" />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            {preferences.pushNotificationsEnabled ? (
              <Switch
                value={preferences.pushNotificationsEnabled}
                onValueChange={(value) => updatePreferences({ pushNotificationsEnabled: value })}
                trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                thumbColor="#FFFFFF"
              />
            ) : (
              <TouchableOpacity
                onPress={handleEnablePushNotifications}
                style={styles.enableButton}
              >
                <Text style={styles.enableButtonText}>Enable</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Volume2 size={20} color="#007AFF" />
              <Text style={styles.settingLabel}>Sound</Text>
            </View>
            <Switch
              value={preferences.soundEnabled}
              onValueChange={(value) => updatePreferences({ soundEnabled: value })}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
              disabled={!preferences.enabled}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Vibrate size={20} color="#007AFF" />
              <Text style={styles.settingLabel}>Vibration</Text>
            </View>
            <Switch
              value={preferences.vibrationEnabled}
              onValueChange={(value) => updatePreferences({ vibrationEnabled: value })}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
              disabled={!preferences.enabled}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Task Updates</Text>
            <Switch
              value={preferences.taskUpdates}
              onValueChange={(value) => updatePreferences({ taskUpdates: value })}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
              disabled={!preferences.enabled}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Task Reminders</Text>
            <Switch
              value={preferences.taskReminders}
              onValueChange={(value) => updatePreferences({ taskReminders: value })}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
              disabled={!preferences.enabled}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Wellness Alerts</Text>
            <Switch
              value={preferences.wellnessAlerts}
              onValueChange={(value) => updatePreferences({ wellnessAlerts: value })}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
              disabled={!preferences.enabled}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Achievements</Text>
            <Switch
              value={preferences.achievements}
              onValueChange={(value) => updatePreferences({ achievements: value })}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
              disabled={!preferences.enabled}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Caregiver Messages</Text>
            <Switch
              value={preferences.caregiverMessages}
              onValueChange={(value) => updatePreferences({ caregiverMessages: value })}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
              disabled={!preferences.enabled}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>System Notifications</Text>
            <Switch
              value={preferences.systemNotifications}
              onValueChange={(value) => updatePreferences({ systemNotifications: value })}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
              disabled={!preferences.enabled}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Moon size={20} color="#007AFF" />
              <Text style={styles.settingLabel}>Enable Quiet Hours</Text>
            </View>
            <Switch
              value={preferences.quietHoursEnabled}
              onValueChange={(value) => updatePreferences({ quietHoursEnabled: value })}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
              disabled={!preferences.enabled}
            />
          </View>

          {preferences.quietHoursEnabled && (
            <View style={styles.quietHoursInfo}>
              <Text style={styles.quietHoursText}>
                Notifications will be silenced during quiet hours
              </Text>
              <Text style={styles.quietHoursSubtext}>
                Configure times in your device settings
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Notifications help you stay on track with your tasks and wellness goals. 
            You can customize which types of notifications you receive.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#8E8E93',
    textTransform: 'uppercase' as const,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#000000',
  },
  enableButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  enableButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  quietHoursInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F2F2F7',
  },
  quietHoursText: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
  },
  quietHoursSubtext: {
    fontSize: 12,
    color: '#8E8E93',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});
