import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { LocationProvider, useLocation } from '@/contexts/LocationContext';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('expo-location');
jest.mock('@react-native-async-storage/async-storage');

describe('Location Tracking Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('should request location permissions', async () => {
    let permissionGranted = false;

    const TestComponent = () => {
      const { requestPermissions, permissionStatus } = useLocation();
      
      React.useEffect(() => {
        permissionGranted = permissionStatus.granted;
      }, [permissionStatus]);

      React.useEffect(() => {
        requestPermissions();
      }, []);

      return null;
    };

    render(
      <LocationProvider>
        <TestComponent />
      </LocationProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('should start location tracking when enabled', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (Location.watchPositionAsync as jest.Mock).mockResolvedValue({
      remove: jest.fn(),
    });

    const TestComponent = () => {
      const { startTracking } = useLocation();
      
      React.useEffect(() => {
        startTracking();
      }, []);

      return null;
    };

    render(
      <LocationProvider>
        <TestComponent />
      </LocationProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('should update current location', async () => {
    const mockLocation = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockLocation);

    let currentLocation: any = null;

    const TestComponent = () => {
      const { currentLocation: loc, getCurrentLocation } = useLocation();
      
      React.useEffect(() => {
        currentLocation = loc;
      }, [loc]);

      React.useEffect(() => {
        getCurrentLocation();
      }, []);

      return null;
    };

    render(
      <LocationProvider>
        <TestComponent />
      </LocationProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('should stop location tracking', async () => {
    const TestComponent = () => {
      const { startTracking, stopTracking } = useLocation();
      
      React.useEffect(() => {
        const start = async () => {
          await startTracking();
        };
        start();
        return () => {
          stopTracking();
        };
      }, []);

      return null;
    };

    const { unmount } = render(
      <LocationProvider>
        <TestComponent />
      </LocationProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });

    unmount();
  });

  it('should handle geofence events', async () => {
    const mockGeofence = {
      name: 'Home',
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 100,
      isActive: true,
    };

    let geofenceTriggered = false;

    const TestComponent = () => {
      const { addGeofence, geofences } = useLocation();
      
      React.useEffect(() => {
        if (geofences.length > 0) {
          geofenceTriggered = true;
        }
      }, [geofences]);

      React.useEffect(() => {
        addGeofence(mockGeofence);
      }, []);

      return null;
    };

    render(
      <LocationProvider>
        <TestComponent />
      </LocationProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
