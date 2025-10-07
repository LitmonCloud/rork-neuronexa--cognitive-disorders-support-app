import { Platform } from 'react-native';
import { Location, Geofence, GeofenceEvent } from '@/types/location';

export class LocationTrackingService {
  private watchId: number | null = null;
  private trackingInterval: ReturnType<typeof setInterval> | null = null;
  private onLocationUpdate: ((location: Location) => void) | null = null;
  private onGeofenceEvent: ((event: GeofenceEvent) => void) | null = null;

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        return result.state === 'granted' || result.state === 'prompt';
      } catch (error) {
        console.error('Failed to check location permissions:', error);
        return false;
      }
    }

    return false;
  }

  async getCurrentLocation(): Promise<Location | null> {
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
  }

  startTracking(
    onUpdate: (location: Location) => void,
    interval: number = 60000
  ): void {
    this.onLocationUpdate = onUpdate;

    if (Platform.OS === 'web') {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          this.onLocationUpdate?.(location);
        },
        (error) => {
          console.error('Location tracking error:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

      this.trackingInterval = setInterval(async () => {
        const location = await this.getCurrentLocation();
        if (location) {
          this.onLocationUpdate?.(location);
        }
      }, interval);
    }
  }

  stopTracking(): void {
    if (Platform.OS === 'web') {
      if (this.watchId !== null) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }

      if (this.trackingInterval) {
        clearInterval(this.trackingInterval);
        this.trackingInterval = null;
      }
    }

    this.onLocationUpdate = null;
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
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
  }

  isInsideGeofence(location: Location, geofence: Geofence): boolean {
    const distance = this.calculateDistance(
      location.latitude,
      location.longitude,
      geofence.latitude,
      geofence.longitude
    );

    return distance <= geofence.radius;
  }

  monitorGeofences(
    location: Location,
    geofences: Geofence[],
    previousStates: Map<string, boolean>,
    patientId: string,
    onEvent: (event: GeofenceEvent) => void
  ): Map<string, boolean> {
    const newStates = new Map<string, boolean>();

    geofences.forEach((geofence) => {
      if (!geofence.isActive) return;

      const isInside = this.isInsideGeofence(location, geofence);
      const wasInside = previousStates.get(geofence.id) || false;

      newStates.set(geofence.id, isInside);

      if (isInside !== wasInside) {
        const event: GeofenceEvent = {
          id: Date.now().toString(),
          patientId,
          geofenceId: geofence.id,
          geofenceName: geofence.name,
          eventType: isInside ? 'enter' : 'exit',
          location,
          timestamp: Date.now(),
        };

        onEvent(event);
      }
    });

    return newStates;
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return data.display_name || null;
    } catch (error) {
      console.error('Failed to reverse geocode:', error);
      return null;
    }
  }

  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  }

  formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return `${seconds}s`;
  }
}

export const locationTrackingService = new LocationTrackingService();
