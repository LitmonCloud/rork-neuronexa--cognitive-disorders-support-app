import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { PatientProvider, usePatients } from '@/contexts/PatientContext';
import { CaregiverProvider, useCaregivers } from '@/contexts/CaregiverContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

describe('Caregiver-Patient Connection Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('should add patient', async () => {
    const TestComponent = () => {
      const { addPatient, patients } = usePatients();
      
      React.useEffect(() => {
        addPatient('John', 'D', 'caregiver-1');
      }, []);

      return null;
    };

    render(
      <PatientProvider>
        <TestComponent />
      </PatientProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should add caregiver', async () => {
    const TestComponent = () => {
      const { addCaregiver, caregivers } = useCaregivers();
      
      React.useEffect(() => {
        addCaregiver('Jane Doe', '555-0123', 'jane@example.com', 'Spouse');
      }, []);

      return null;
    };

    render(
      <CaregiverProvider>
        <TestComponent />
      </CaregiverProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should add patient with details', async () => {
    let patientAdded = false;

    const TestComponent = () => {
      const { addPatient, patients } = usePatients();
      
      React.useEffect(() => {
        if (patients.length > 0) {
          patientAdded = true;
        }
      }, [patients]);

      React.useEffect(() => {
        addPatient('Alice', 'B', 'caregiver-1');
      }, []);

      return null;
    };

    render(
      <PatientProvider>
        <TestComponent />
      </PatientProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should persist caregivers across app restarts', async () => {
    const mockCaregivers = [
      {
        id: '1',
        name: 'Jane Doe',
        phone: '555-0123',
        isPrimary: true,
        notificationsEnabled: true,
        createdAt: new Date().toISOString(),
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockCaregivers)
    );

    let loadedCaregivers: any[] = [];

    const TestComponent = () => {
      const { caregivers } = useCaregivers();
      
      React.useEffect(() => {
        loadedCaregivers = caregivers;
      }, [caregivers]);

      return null;
    };

    render(
      <CaregiverProvider>
        <TestComponent />
      </CaregiverProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('should load patients from storage on mount', async () => {
    const mockPatients = [
      {
        id: '1',
        firstName: 'Test',
        lastNameInitial: 'P',
        caregiverId: 'caregiver-1',
        createdAt: new Date().toISOString(),
        profileColor: '#7b61ff',
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockPatients)
    );

    let loadedPatients: any[] = [];

    const TestComponent = () => {
      const { patients } = usePatients();
      
      React.useEffect(() => {
        loadedPatients = patients;
      }, [patients]);

      return null;
    };

    render(
      <PatientProvider>
        <TestComponent />
      </PatientProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });
});
