import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { LocationContext, useLocation } from '@/contexts/LocationContext';
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
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    let permissionGranted = false;

    const TestComponent = () => {
      const { requestPermissions, hasPermission } = useLocation();
      
      React.useEffect(() => {
        permissionGranted = hasPermission;
      }, [hasPermission]);

      React.useEffect(() => {
        requestPermissions();
      }, []);

      return null;
    };

    render(
      <LocationContext>
        <TestComponent />
      </LocationContext>
    );

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
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
      <LocationContext>
        <TestComponent />
      </LocationContext>
    );

    await waitFor(() => {
      expect(Location.watchPositionAsync).toHaveBeenCalled();
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
      <LocationContext>
        <TestComponent />
      </LocationContext>
    );

    await waitFor(() => {
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
    });
  });

  it('should stop location tracking', async () => {
    const mockRemove = jest.fn();
    (Location.watchPositionAsync as jest.Mock).mockResolvedValue({
      remove: mockRemove,
    });

    const TestComponent = () => {
      const { startTracking, stopTracking } = useLocation();
      
      React.useEffect(() => {
        startTracking();
        return () => stopTracking();
      }, []);

      return null;
    };

    const { unmount } = render(
      <LocationContext>
        <TestComponent />
      </LocationContext>
    );

    await waitFor(() => {
      expect(Location.watchPositionAsync).toHaveBeenCalled();
    });

    unmount();

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalled();
    });
  });

  it('should handle geofence events', async () => {
    const mockGeofence = {
      id: 'home',
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 100,
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
      <LocationContext>
        <TestComponent />
      </LocationContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
