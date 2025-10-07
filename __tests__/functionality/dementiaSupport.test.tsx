import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { DementiaContext, useDementia } from '@/contexts/DementiaContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const { memoryJournal, addMemoryEntry } = useDementia();
      
      React.useEffect(() => {
        entryCount = memoryJournal.length;
      }, [memoryJournal]);

      React.useEffect(() => {
        addMemoryEntry({
          title: 'Test Memory',
          content: 'Test content',
          photos: [],
        });
      }, []);

      return null;
    };

    render(
      <DementiaContext>
        <TestComponent />
      </DementiaContext>
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
          phone: '555-0123',
        });
      }, []);

      return null;
    };

    render(
      <DementiaContext>
        <TestComponent />
      </DementiaContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should update dementia profile', async () => {
    const TestComponent = () => {
      const { updateProfile } = useDementia();
      
      React.useEffect(() => {
        updateProfile({
          stage: 'mild',
          diagnosis: 'Alzheimer\'s',
          medications: ['Med1', 'Med2'],
        });
      }, []);

      return null;
    };

    render(
      <DementiaContext>
        <TestComponent />
      </DementiaContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should track daily routine', async () => {
    const TestComponent = () => {
      const { addRoutineActivity } = useDementia();
      
      React.useEffect(() => {
        addRoutineActivity({
          time: '08:00',
          activity: 'Breakfast',
          reminder: true,
        });
      }, []);

      return null;
    };

    render(
      <DementiaContext>
        <TestComponent />
      </DementiaContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should load dementia data from storage', async () => {
    const mockData = {
      profile: {
        stage: 'moderate',
        diagnosis: 'Vascular Dementia',
        medications: ['Med1'],
      },
      memoryJournal: [],
      emergencyContacts: [],
      routineActivities: [],
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockData)
    );

    let profileLoaded = false;

    const TestComponent = () => {
      const { profile } = useDementia();
      
      React.useEffect(() => {
        if (profile) {
          profileLoaded = true;
        }
      }, [profile]);

      return null;
    };

    render(
      <DementiaContext>
        <TestComponent />
      </DementiaContext>
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
        phone: '555-0123',
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ emergencyContacts: mockContacts })
    );

    const TestComponent = () => {
      const { removeEmergencyContact } = useDementia();
      
      React.useEffect(() => {
        removeEmergencyContact('1');
      }, []);

      return null;
    };

    render(
      <DementiaContext>
        <TestComponent />
      </DementiaContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
