import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Location,
  Geofence,
  LocationUpdate,
  GeofenceEvent,
  LocationSettings,
  LocationPermissionStatus,
} from '@/types/location';
import { useUserProfile } from './UserProfileContext';

const LOCATION_SETTINGS_KEY = 'location_settings';
const GEOFENCES_KEY = 'geofences';

const defaultSettings: LocationSettings = {
  trackingEnabled: false,
  updateInterval: 300000,
  geofencesEnabled: true,
  alertOnGeofenceExit: true,
  shareLocationWithCaregiver: true,
};

export const [LocationProvider, useLocation] = createContextHook(() => {
  const { profile } = useUserProfile();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationHistory, setLocationHistory] = useState<Location[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [geofenceEvents, setGeofenceEvents] = useState<GeofenceEvent[]>([]);
  const [settings, setSettings] = useState<LocationSettings>(defaultSettings);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>({
    granted: false,
    canAskAgain: true,
    foreground: false,
    background: false,
  });
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  useEffect(() => {
    loadSettings();
    loadGeofences();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(LOCATION_SETTINGS_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load location settings:', error);
    }
  };

  const loadGeofences = async () => {
    try {
      const stored = await AsyncStorage.getItem(GEOFENCES_KEY);
      if (stored) {
        setGeofences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load geofences:', error);
    }
  };

  const updateSettings = useCallback(async (newSettings: Partial<LocationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await AsyncStorage.setItem(LOCATION_SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save location settings:', error);
    }
  }, [settings]);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        const granted = result.state === 'granted';
        setPermissionStatus({
          granted,
          canAskAgain: result.state !== 'denied',
          foreground: granted,
          background: false,
        });
        return granted;
      } catch (error) {
        console.error('Failed to check location permissions:', error);
        return false;
      }
    }

    return false;
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<Location | null> => {
    if (Platform.OS === 'web') {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location: Location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            };
            setCurrentLocation(location);
            setLastUpdate(Date.now());
            resolve(location);
          },
          (error) => {
            console.error('Failed to get location:', error);
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      });
    }

    return null;
  }, []);

  const addToHistory = useCallback((location: Location) => {
    setLocationHistory((prev) => {
      const updated = [...prev, location];
      return updated.slice(-100);
    });
  }, []);

  const startTracking = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.log('Location permission not granted');
      return;
    }

    setIsTracking(true);
    await updateSettings({ trackingEnabled: true });

    const location = await getCurrentLocation();
    if (location) {
      addToHistory(location);
    }
  }, [requestPermissions, getCurrentLocation, updateSettings, addToHistory]);

  const stopTracking = useCallback(async () => {
    setIsTracking(false);
    await updateSettings({ trackingEnabled: false });
  }, [updateSettings]);

  const addGeofence = useCallback(async (geofence: Omit<Geofence, 'id' | 'createdAt'>) => {
    const newGeofence: Geofence = {
      ...geofence,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };

    const updated = [...geofences, newGeofence];
    setGeofences(updated);

    try {
      await AsyncStorage.setItem(GEOFENCES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save geofence:', error);
    }

    return newGeofence;
  }, [geofences]);

  const removeGeofence = useCallback(async (geofenceId: string) => {
    const updated = geofences.filter((g) => g.id !== geofenceId);
    setGeofences(updated);

    try {
      await AsyncStorage.setItem(GEOFENCES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove geofence:', error);
    }
  }, [geofences]);

  const toggleGeofence = useCallback(async (geofenceId: string) => {
    const updated = geofences.map((g) =>
      g.id === geofenceId ? { ...g, isActive: !g.isActive } : g
    );
    setGeofences(updated);

    try {
      await AsyncStorage.setItem(GEOFENCES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to toggle geofence:', error);
    }
  }, [geofences]);

  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }, []);

  const checkPreviousGeofenceState = useCallback((geofenceId: string): boolean => {
    const lastEvent = geofenceEvents
      .filter((e) => e.geofenceId === geofenceId)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    return lastEvent?.eventType === 'enter';
  }, [geofenceEvents]);

  const checkGeofences = useCallback((location: Location) => {
    if (!settings.geofencesEnabled) return;

    geofences.forEach((geofence) => {
      if (!geofence.isActive) return;

      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        geofence.latitude,
        geofence.longitude
      );

      const isInside = distance <= geofence.radius;
      const wasInside = checkPreviousGeofenceState(geofence.id);

      if (isInside !== wasInside) {
        const event: GeofenceEvent = {
          id: Date.now().toString(),
          patientId: profile?.userId || '',
          geofenceId: geofence.id,
          geofenceName: geofence.name,
          eventType: isInside ? 'enter' : 'exit',
          location,
          timestamp: Date.now(),
        };

        setGeofenceEvents((prev) => [...prev, event]);

        if (event.eventType === 'exit' && settings.alertOnGeofenceExit) {
          console.log(`Patient exited geofence: ${geofence.name}`);
        }
      }
    });
  }, [settings.geofencesEnabled, settings.alertOnGeofenceExit, geofences, profile, calculateDistance, checkPreviousGeofenceState]);

  const clearHistory = useCallback(() => {
    setLocationHistory([]);
  }, []);

  const getLocationUpdate = useCallback((): LocationUpdate | null => {
    if (!currentLocation || !profile) return null;

    return {
      patientId: profile.userId,
      location: currentLocation,
      isMoving: false,
    };
  }, [currentLocation, profile]);

  return useMemo(() => ({
    currentLocation,
    locationHistory,
    geofences,
    geofenceEvents,
    settings,
    permissionStatus,
    isTracking,
    lastUpdate,
    requestPermissions,
    getCurrentLocation,
    startTracking,
    stopTracking,
    updateSettings,
    addGeofence,
    removeGeofence,
    toggleGeofence,
    checkGeofences,
    clearHistory,
    getLocationUpdate,
  }), [
    currentLocation,
    locationHistory,
    geofences,
    geofenceEvents,
    settings,
    permissionStatus,
    isTracking,
    lastUpdate,
    requestPermissions,
    getCurrentLocation,
    startTracking,
    stopTracking,
    updateSettings,
    addGeofence,
    removeGeofence,
    toggleGeofence,
    checkGeofences,
    clearHistory,
    getLocationUpdate,
  ]);
});
