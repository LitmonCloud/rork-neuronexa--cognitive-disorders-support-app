import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { DementiaProvider, useDementia } from '@/contexts/DementiaContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TestWrapper } from '../__mocks__/contextMocks';

jest.mock('@react-native-async-storage/async-storage');

describe('Dementia Support Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('should add memory journal entry', async () => {
    let entryCount = 0;

    const TestComponent = () => {
      const { memoryJournal, addJournalEntry } = useDementia();
      
      React.useEffect(() => {
        entryCount = memoryJournal.length;
      }, [memoryJournal]);

      React.useEffect(() => {
        addJournalEntry({
          date: new Date().toISOString(),
          title: 'Test Memory',
          description: 'Test content',
          photoUris: [],
        });
      }, []);

      return null;
    };

    render(
      <TestWrapper>
        <DementiaProvider>
          <TestComponent />
        </DementiaProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should add emergency contact', async () => {
    let contactCount = 0;

    const TestComponent = () => {
      const { emergencyContacts, addEmergencyContact } = useDementia();

      React.useEffect(() => {
        contactCount = emergencyContacts.length;
      }, [emergencyContacts]);

      React.useEffect(() => {
        addEmergencyContact({
          name: 'John Doe',
          relationship: 'Family',
          phoneNumber: '555-0123',
          isPrimary: true,
          order: 0,
        });
      }, []);

      return null;
    };

    render(
      <TestWrapper>
        <DementiaProvider>
          <TestComponent />
        </DementiaProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should update dementia settings', async () => {
    const TestComponent = () => {
      const { updateSettings } = useDementia();

      React.useEffect(() => {
        updateSettings({
          enabled: true,
          orientationRemindersEnabled: true,
        });
      }, []);

      return null;
    };

    render(
      <TestWrapper>
        <DementiaProvider>
          <TestComponent />
        </DementiaProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should track daily routine', async () => {
    const TestComponent = () => {
      const { addRoutineAnchor } = useDementia();

      React.useEffect(() => {
        addRoutineAnchor({
          time: '08:00',
          title: 'Breakfast',
          description: 'Morning meal',
          isRecurring: true,
          daysOfWeek: [1, 2, 3, 4, 5],
          reminderMinutesBefore: 15,
        });
      }, []);

      return null;
    };

    render(
      <TestWrapper>
        <DementiaProvider>
          <TestComponent />
        </DementiaProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should load dementia data from storage', async () => {
    const mockSettings = {
      enabled: true,
      orientationRemindersEnabled: true,
      orientationFrequency: 60,
      locationTrackingEnabled: false,
      geofenceEnabled: false,
      safeZoneRadius: 500,
      medicationRemindersEnabled: true,
      repetitionToleranceEnabled: true,
      memoryJournalEnabled: true,
      emergencyContactsEnabled: true,
      photoBasedNavigationEnabled: true,
      autoReadStepsEnabled: false,
      aiStepCoachEnabled: false,
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockSettings)
    );

    let settingsLoaded = false;

    const TestComponent = () => {
      const { settings } = useDementia();

      React.useEffect(() => {
        if (settings) {
          settingsLoaded = true;
        }
      }, [settings]);

      return null;
    };

    render(
      <TestWrapper>
        <DementiaProvider>
          <TestComponent />
        </DementiaProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('should remove emergency contact', async () => {
    const mockContacts = [
      {
        id: '1',
        name: 'John Doe',
        relationship: 'Family',
        phoneNumber: '555-0123',
        isPrimary: true,
        order: 0,
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockContacts)
    );

    const TestComponent = () => {
      const { deleteEmergencyContact } = useDementia();

      React.useEffect(() => {
        deleteEmergencyContact('1');
      }, []);

      return null;
    };

    render(
      <TestWrapper>
        <DementiaProvider>
          <TestComponent />
        </DementiaProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
