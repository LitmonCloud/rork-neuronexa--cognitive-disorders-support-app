export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

export interface Geofence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  isActive: boolean;
  createdAt: number;
}

export interface LocationUpdate {
  patientId: string;
  location: Location;
  batteryLevel?: number;
  isMoving: boolean;
}

export interface GeofenceEvent {
  id: string;
  patientId: string;
  geofenceId: string;
  geofenceName: string;
  eventType: 'enter' | 'exit';
  location: Location;
  timestamp: number;
}

export interface LocationHistory {
  patientId: string;
  locations: Location[];
  startDate: number;
  endDate: number;
}

export interface LocationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  foreground: boolean;
  background: boolean;
}

export interface LocationSettings {
  trackingEnabled: boolean;
  updateInterval: number;
  geofencesEnabled: boolean;
  alertOnGeofenceExit: boolean;
  shareLocationWithCaregiver: boolean;
}
