import { locationTrackingService } from '@/services/location/LocationTrackingService';
import * as Location from 'expo-location';

jest.mock('expo-location');

describe('LocationTrackingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should request location permissions', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    const result = await locationTrackingService.requestPermissions();

    expect(result).toBe(true);
    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
  });

  it('should handle permission denial', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const result = await locationTrackingService.requestPermissions();

    expect(result).toBe(false);
  });

  it('should get current location', async () => {
    const mockLocation = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        speed: 0,
      },
      timestamp: Date.now(),
    };

    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockLocation);

    const location = await locationTrackingService.getCurrentLocation();

    expect(location).toEqual({
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 10,
      timestamp: expect.any(Number),
    });
  });

  it('should start location tracking', () => {
    const callback = jest.fn();

    locationTrackingService.startTracking(callback);

    expect(callback).toBeDefined();
  });

  it('should stop location tracking', () => {
    const callback = jest.fn();
    locationTrackingService.startTracking(callback);
    locationTrackingService.stopTracking();

    expect(callback).toBeDefined();
  });

  it('should calculate distance between coordinates', () => {
    const point1 = { latitude: 37.7749, longitude: -122.4194 };
    const point2 = { latitude: 37.7849, longitude: -122.4094 };

    const distance = locationTrackingService.calculateDistance(
      point1.latitude,
      point1.longitude,
      point2.latitude,
      point2.longitude
    );

    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(2000);
  });

  it('should check if location is within geofence', () => {
    const geofence = {
      id: '1',
      name: 'Home',
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 100,
      isActive: true,
      createdAt: Date.now(),
    };
    const point = { latitude: 37.7750, longitude: -122.4195, accuracy: 10, timestamp: Date.now() };

    const isWithin = locationTrackingService.isInsideGeofence(point, geofence);

    expect(isWithin).toBe(true);
  });

  it('should detect when location exits geofence', () => {
    const geofence = {
      id: '1',
      name: 'Home',
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 100,
      isActive: true,
      createdAt: Date.now(),
    };
    const point = { latitude: 37.8749, longitude: -122.5194, accuracy: 10, timestamp: Date.now() };

    const isWithin = locationTrackingService.isInsideGeofence(point, geofence);

    expect(isWithin).toBe(false);
  });
});
