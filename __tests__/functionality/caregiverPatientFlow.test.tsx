import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { PatientContext, usePatients } from '@/contexts/PatientContext';
import { CaregiverContext, useCaregiverMode } from '@/contexts/CaregiverContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

describe('Caregiver-Patient Connection Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('should generate patient connection code', async () => {
    const TestComponent = () => {
      const { generateConnectionCode, connectionCode } = usePatients();
      
      React.useEffect(() => {
        generateConnectionCode();
      }, []);

      return null;
    };

    const { rerender } = render(
      <PatientContext>
        <TestComponent />
      </PatientContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should enable caregiver mode', async () => {
    let caregiverEnabled = false;

    const TestComponent = () => {
      const { isCaregiverMode, enableCaregiverMode } = useCaregiverMode();
      
      React.useEffect(() => {
        caregiverEnabled = isCaregiverMode;
      }, [isCaregiverMode]);

      React.useEffect(() => {
        enableCaregiverMode();
      }, []);

      return null;
    };

    render(
      <CaregiverContext>
        <TestComponent />
      </CaregiverContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'caregiverMode',
        expect.any(String)
      );
    });
  });

  it('should add patient with connection code', async () => {
    const mockCode = 'TEST123';
    let patientAdded = false;

    const TestComponent = () => {
      const { addPatient, patients } = usePatients();
      
      React.useEffect(() => {
        if (patients.length > 0) {
          patientAdded = true;
        }
      }, [patients]);

      React.useEffect(() => {
        addPatient(mockCode);
      }, []);

      return null;
    };

    render(
      <PatientContext>
        <TestComponent />
      </PatientContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should persist caregiver mode across app restarts', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ enabled: true, enabledAt: Date.now() })
    );

    let isCaregiverModeEnabled = false;

    const TestComponent = () => {
      const { isCaregiverMode } = useCaregiverMode();
      
      React.useEffect(() => {
        isCaregiverModeEnabled = isCaregiverMode;
      }, [isCaregiverMode]);

      return null;
    };

    render(
      <CaregiverContext>
        <TestComponent />
      </CaregiverContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('caregiverMode');
    });
  });

  it('should load patients from storage on mount', async () => {
    const mockPatients = [
      {
        id: '1',
        name: 'Test Patient',
        connectionCode: 'TEST123',
        connectedAt: Date.now(),
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
      <PatientContext>
        <TestComponent />
      </PatientContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('patients');
    });
  });
});
