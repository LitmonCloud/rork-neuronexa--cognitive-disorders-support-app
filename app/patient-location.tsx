import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Plus, Trash2, Clock, Navigation } from 'lucide-react-native';
import { useLocation } from '@/contexts/LocationContext';

export default function PatientLocationScreen() {
  const {
    currentLocation,
    geofences,
    settings,
    isTracking,
    lastUpdate,
    startTracking,
    stopTracking,
    updateSettings,
    addGeofence,
    removeGeofence,
    toggleGeofence,
    requestPermissions,
  } = useLocation();

  const [showAddGeofence, setShowAddGeofence] = useState(false);
  const [newGeofenceName, setNewGeofenceName] = useState('');
  const [newGeofenceRadius, setNewGeofenceRadius] = useState('100');

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  const handleToggleTracking = async () => {
    if (isTracking) {
      await stopTracking();
    } else {
      await startTracking();
    }
  };

  const handleAddGeofence = async () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Please enable location tracking first');
      return;
    }

    if (!newGeofenceName.trim()) {
      Alert.alert('Error', 'Please enter a geofence name');
      return;
    }

    const radius = parseInt(newGeofenceRadius, 10);
    if (isNaN(radius) || radius < 10 || radius > 10000) {
      Alert.alert('Error', 'Radius must be between 10 and 10000 meters');
      return;
    }

    await addGeofence({
      name: newGeofenceName,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      radius,
      isActive: true,
    });

    setNewGeofenceName('');
    setNewGeofenceRadius('100');
    setShowAddGeofence(false);
  };

  const handleRemoveGeofence = (geofenceId: string) => {
    Alert.alert(
      'Remove Geofence',
      'Are you sure you want to remove this geofence?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeGeofence(geofenceId),
        },
      ]
    );
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Never';
    const diff = Date.now() - lastUpdate;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Location Tracking',
          headerStyle: { backgroundColor: '#6366F1' },
          headerTintColor: '#fff',
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Navigation size={24} color="#6366F1" />
            <Text style={styles.sectionTitle}>Tracking Status</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.trackingRow}>
              <View style={styles.trackingInfo}>
                <Text style={styles.trackingLabel}>Location Tracking</Text>
                <Text style={styles.trackingStatus}>
                  {isTracking ? 'Active' : 'Inactive'}
                </Text>
              </View>
              <Switch
                value={isTracking}
                onValueChange={handleToggleTracking}
                trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
                thumbColor="#fff"
              />
            </View>

            {currentLocation && (
              <View style={styles.locationInfo}>
                <View style={styles.locationRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.locationText}>
                    {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                  </Text>
                </View>
                <View style={styles.locationRow}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.locationText}>Last update: {formatLastUpdate()}</Text>
                </View>
                <Text style={styles.accuracyText}>
                  Accuracy: ±{Math.round(currentLocation.accuracy)}m
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Share with Caregiver</Text>
              <Switch
                value={settings.shareLocationWithCaregiver}
                onValueChange={(value) =>
                  updateSettings({ shareLocationWithCaregiver: value })
                }
                trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Geofence Alerts</Text>
              <Switch
                value={settings.alertOnGeofenceExit}
                onValueChange={(value) => updateSettings({ alertOnGeofenceExit: value })}
                trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Safe Zones ({geofences.length})</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddGeofence(!showAddGeofence)}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {showAddGeofence && (
            <View style={styles.addGeofenceCard}>
              <TextInput
                style={styles.input}
                placeholder="Zone name (e.g., Home)"
                value={newGeofenceName}
                onChangeText={setNewGeofenceName}
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                style={styles.input}
                placeholder="Radius (meters)"
                value={newGeofenceRadius}
                onChangeText={setNewGeofenceRadius}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleAddGeofence}>
                <Text style={styles.saveButtonText}>Save Zone</Text>
              </TouchableOpacity>
            </View>
          )}

          {geofences.map((geofence) => (
            <View key={geofence.id} style={styles.geofenceCard}>
              <View style={styles.geofenceHeader}>
                <View style={styles.geofenceInfo}>
                  <Text style={styles.geofenceName}>{geofence.name}</Text>
                  <Text style={styles.geofenceDetails}>
                    Radius: {geofence.radius}m
                  </Text>
                </View>
                <View style={styles.geofenceActions}>
                  <Switch
                    value={geofence.isActive}
                    onValueChange={() => toggleGeofence(geofence.id)}
                    trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
                    thumbColor="#fff"
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleRemoveGeofence(geofence.id)}
                  >
                    <Trash2 size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {geofences.length === 0 && !showAddGeofence && (
            <View style={styles.emptyState}>
              <MapPin size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No safe zones yet</Text>
              <Text style={styles.emptySubtext}>
                Add safe zones to get alerts when you leave
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.infoText}>
            Location tracking helps your caregiver ensure your safety. Your location is only
            shared when tracking is enabled.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    flex: 1,
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  trackingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackingInfo: {
    flex: 1,
  },
  trackingLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#111827',
    marginBottom: 4,
  },
  trackingStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
  locationInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  accuracyText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingLabel: {
    fontSize: 16,
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#6366F1',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addGeofenceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  geofenceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  geofenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  geofenceInfo: {
    flex: 1,
  },
  geofenceName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 4,
  },
  geofenceDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  geofenceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#6B7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
  },
});
