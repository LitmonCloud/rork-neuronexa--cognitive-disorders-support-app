export interface Patient {
  id: string;
  firstName: string;
  lastNameInitial: string;
  createdAt: string;
  caregiverId: string;
  lastActivity?: string;
  profileColor?: string;
}

export interface PatientTask {
  patientId: string;
  taskId: string;
  createdBy: 'caregiver' | 'patient';
  createdAt: string;
  lastModifiedBy?: 'caregiver' | 'patient';
  lastModifiedAt?: string;
}
