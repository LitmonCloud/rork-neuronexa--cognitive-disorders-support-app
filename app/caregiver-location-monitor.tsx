import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Clock, AlertCircle, Navigation, Activity } from 'lucide-react-native';
import { usePatients } from '@/contexts/PatientContext';
import { Location } from '@/types/location';
import { Patient } from '@/types/patient';

interface PatientLocationData {
  patientId: string;
  patientName: string;
  location: Location | null;
  lastUpdate: number;
  isTracking: boolean;
  geofenceAlerts: {
    id: string;
    message: string;
    timestamp: number;
  }[];
}



export default function CaregiverLocationMonitorScreen() {
  const { patients } = usePatients();
  const [refreshing, setRefreshing] = useState(false);
  const [patientLocations, setPatientLocations] = useState<PatientLocationData[]>([]);

  const loadPatientLocations = useCallback(() => {
    const locations: PatientLocationData[] = patients.map((patient: Patient) => ({
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastNameInitial}.`,
      location: null,
      lastUpdate: Date.now(),
      isTracking: false,
      geofenceAlerts: [],
    }));

    setPatientLocations(locations);
  }, [patients]);

  useEffect(() => {
    loadPatientLocations();
  }, [loadPatientLocations]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPatientLocations();
    setRefreshing(false);
  };

  const formatLastUpdate = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatCoordinates = (location: Location) => {
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
  };

  const openMapView = (patientId: string) => {
    console.log('Opening map for patient:', patientId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Patient Locations',
          headerStyle: { backgroundColor: '#6366F1' },
          headerTintColor: '#fff',
        }}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Navigation size={24} color="#6366F1" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Location Monitoring</Text>
            <Text style={styles.headerSubtitle}>
              Track your patients&apos; locations in real-time
            </Text>
          </View>
        </View>

        {patientLocations.length === 0 ? (
          <View style={styles.emptyState}>
            <MapPin size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No patients added yet</Text>
            <Text style={styles.emptySubtext}>
              Add patients to monitor their locations
            </Text>
          </View>
        ) : (
          patientLocations.map((data) => (
            <View key={data.patientId} style={styles.patientCard}>
              <View style={styles.patientHeader}>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>{data.patientName}</Text>
                  <View style={styles.statusRow}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: data.isTracking ? '#10B981' : '#EF4444' },
                      ]}
                    />
                    <Text style={styles.statusText}>
                      {data.isTracking ? 'Tracking Active' : 'Tracking Inactive'}
                    </Text>
                  </View>
                </View>
                {data.geofenceAlerts.length > 0 && (
                  <View style={styles.alertBadge}>
                    <AlertCircle size={16} color="#fff" />
                    <Text style={styles.alertCount}>{data.geofenceAlerts.length}</Text>
                  </View>
                )}
              </View>

              {data.location ? (
                <View style={styles.locationDetails}>
                  <View style={styles.locationRow}>
                    <MapPin size={16} color="#6B7280" />
                    <Text style={styles.locationText}>
                      {formatCoordinates(data.location)}
                    </Text>
                  </View>
                  <View style={styles.locationRow}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.locationText}>
                      Updated {formatLastUpdate(data.lastUpdate)}
                    </Text>
                  </View>
                  <View style={styles.locationRow}>
                    <Activity size={16} color="#6B7280" />
                    <Text style={styles.locationText}>
                      Accuracy: ±{Math.round(data.location.accuracy)}m
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => openMapView(data.patientId)}
                  >
                    <MapPin size={16} color="#fff" />
                    <Text style={styles.mapButtonText}>View on Map</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.noLocationState}>
                  <Text style={styles.noLocationText}>
                    Location not available
                  </Text>
                  <Text style={styles.noLocationSubtext}>
                    Patient needs to enable location tracking
                  </Text>
                </View>
              )}

              {data.geofenceAlerts.length > 0 && (
                <View style={styles.alertsSection}>
                  <Text style={styles.alertsTitle}>Recent Alerts</Text>
                  {data.geofenceAlerts.map((alert) => (
                    <View key={alert.id} style={styles.alertItem}>
                      <AlertCircle size={14} color="#EF4444" />
                      <Text style={styles.alertMessage}>{alert.message}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Location data is updated automatically when patients have tracking enabled.
            Pull down to refresh manually.
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  alertCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  locationDetails: {
    paddingTop: 12,
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
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  noLocationState: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  noLocationText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#6B7280',
    marginBottom: 4,
  },
  noLocationSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  alertsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  alertsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 8,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  alertMessage: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  infoSection: {
    padding: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    textAlign: 'center',
  },
});
