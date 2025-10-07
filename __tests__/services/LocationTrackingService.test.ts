import { locationTracking } from '@/services/location/LocationTrackingService';
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

    const result = await locationTracking.requestPermissions();

    expect(result).toBe(true);
    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
  });

  it('should handle permission denial', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const result = await locationTracking.requestPermissions();

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

    const location = await locationTracking.getCurrentLocation();

    expect(location).toEqual({
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 10,
      timestamp: expect.any(Number),
    });
  });

  it('should start location tracking', async () => {
    const callback = jest.fn();

    await locationTracking.startTracking(callback);

    expect(Location.watchPositionAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      }),
      expect.any(Function)
    );
  });

  it('should stop location tracking', async () => {
    const mockRemove = jest.fn();
    (Location.watchPositionAsync as jest.Mock).mockResolvedValue({
      remove: mockRemove,
    });

    const callback = jest.fn();
    await locationTracking.startTracking(callback);
    await locationTracking.stopTracking();

    expect(mockRemove).toHaveBeenCalled();
  });

  it('should calculate distance between coordinates', () => {
    const point1 = { latitude: 37.7749, longitude: -122.4194 };
    const point2 = { latitude: 37.7849, longitude: -122.4094 };

    const distance = locationTracking.calculateDistance(point1, point2);

    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(2000);
  });

  it('should check if location is within geofence', () => {
    const center = { latitude: 37.7749, longitude: -122.4194 };
    const point = { latitude: 37.7750, longitude: -122.4195 };
    const radius = 100;

    const isWithin = locationTracking.isWithinGeofence(point, center, radius);

    expect(isWithin).toBe(true);
  });

  it('should detect when location exits geofence', () => {
    const center = { latitude: 37.7749, longitude: -122.4194 };
    const point = { latitude: 37.8749, longitude: -122.5194 };
    const radius = 100;

    const isWithin = locationTracking.isWithinGeofence(point, center, radius);

    expect(isWithin).toBe(false);
  });
});
