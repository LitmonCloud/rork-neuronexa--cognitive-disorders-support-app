import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import {
  DementiaSettings,
  EmergencyContact,
  MedicationReminder,
  MemoryJournalEntry,
  SafeZone,
  DailyRoutineAnchor,
  RepetitiveQuestion,
  OrientationInfo,
} from '@/types/dementia';

const DEMENTIA_SETTINGS_KEY = '@neuronexa_dementia_settings';
const EMERGENCY_CONTACTS_KEY = '@neuronexa_emergency_contacts';
const MEDICATIONS_KEY = '@neuronexa_medications';
const MEMORY_JOURNAL_KEY = '@neuronexa_memory_journal';
const SAFE_ZONES_KEY = '@neuronexa_safe_zones';
const ROUTINE_ANCHORS_KEY = '@neuronexa_routine_anchors';
const REPETITIVE_QUESTIONS_KEY = '@neuronexa_repetitive_questions';

async function loadDementiaSettings(): Promise<DementiaSettings> {
  try {
    const stored = await AsyncStorage.getItem(DEMENTIA_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    const defaultSettings: DementiaSettings = {
      enabled: false,
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
    };
    await AsyncStorage.setItem(DEMENTIA_SETTINGS_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  } catch (error) {
    console.error('[DementiaContext] Error loading settings:', error);
    return {
      enabled: false,
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
    };
  }
}

async function loadEmergencyContacts(): Promise<EmergencyContact[]> {
  try {
    const stored = await AsyncStorage.getItem(EMERGENCY_CONTACTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('[DementiaContext] Error loading emergency contacts:', error);
    return [];
  }
}

async function loadMedications(): Promise<MedicationReminder[]> {
  try {
    const stored = await AsyncStorage.getItem(MEDICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('[DementiaContext] Error loading medications:', error);
    return [];
  }
}

async function loadMemoryJournal(): Promise<MemoryJournalEntry[]> {
  try {
    const stored = await AsyncStorage.getItem(MEMORY_JOURNAL_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('[DementiaContext] Error loading memory journal:', error);
    return [];
  }
}

async function loadSafeZones(): Promise<SafeZone[]> {
  try {
    const stored = await AsyncStorage.getItem(SAFE_ZONES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('[DementiaContext] Error loading safe zones:', error);
    return [];
  }
}

async function loadRoutineAnchors(): Promise<DailyRoutineAnchor[]> {
  try {
    const stored = await AsyncStorage.getItem(ROUTINE_ANCHORS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('[DementiaContext] Error loading routine anchors:', error);
    return [];
  }
}

async function loadRepetitiveQuestions(): Promise<RepetitiveQuestion[]> {
  try {
    const stored = await AsyncStorage.getItem(REPETITIVE_QUESTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('[DementiaContext] Error loading repetitive questions:', error);
    return [];
  }
}

export const [DementiaProvider, useDementia] = createContextHook(() => {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ['dementiaSettings'],
    queryFn: loadDementiaSettings,
  });

  const contactsQuery = useQuery({
    queryKey: ['emergencyContacts'],
    queryFn: loadEmergencyContacts,
  });

  const medicationsQuery = useQuery({
    queryKey: ['medications'],
    queryFn: loadMedications,
  });

  const journalQuery = useQuery({
    queryKey: ['memoryJournal'],
    queryFn: loadMemoryJournal,
  });

  const safeZonesQuery = useQuery({
    queryKey: ['safeZones'],
    queryFn: loadSafeZones,
  });

  const routineAnchorsQuery = useQuery({
    queryKey: ['routineAnchors'],
    queryFn: loadRoutineAnchors,
  });

  const repetitiveQuestionsQuery = useQuery({
    queryKey: ['repetitiveQuestions'],
    queryFn: loadRepetitiveQuestions,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: DementiaSettings) => {
      await AsyncStorage.setItem(DEMENTIA_SETTINGS_KEY, JSON.stringify(settings));
      return settings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['dementiaSettings'], data);
    },
  });
  const { mutate: mutateSettings } = updateSettingsMutation;

  const updateContactsMutation = useMutation({
    mutationFn: async (contacts: EmergencyContact[]) => {
      await AsyncStorage.setItem(EMERGENCY_CONTACTS_KEY, JSON.stringify(contacts));
      return contacts;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['emergencyContacts'], data);
    },
  });
  const { mutate: mutateContacts } = updateContactsMutation;

  const updateMedicationsMutation = useMutation({
    mutationFn: async (medications: MedicationReminder[]) => {
      await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
      return medications;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['medications'], data);
    },
  });
  const { mutate: mutateMedications } = updateMedicationsMutation;

  const updateJournalMutation = useMutation({
    mutationFn: async (entries: MemoryJournalEntry[]) => {
      await AsyncStorage.setItem(MEMORY_JOURNAL_KEY, JSON.stringify(entries));
      return entries;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['memoryJournal'], data);
    },
  });
  const { mutate: mutateJournal } = updateJournalMutation;

  const updateSafeZonesMutation = useMutation({
    mutationFn: async (zones: SafeZone[]) => {
      await AsyncStorage.setItem(SAFE_ZONES_KEY, JSON.stringify(zones));
      return zones;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['safeZones'], data);
    },
  });
  const { mutate: mutateSafeZones } = updateSafeZonesMutation;

  const updateRoutineAnchorsMutation = useMutation({
    mutationFn: async (anchors: DailyRoutineAnchor[]) => {
      await AsyncStorage.setItem(ROUTINE_ANCHORS_KEY, JSON.stringify(anchors));
      return anchors;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['routineAnchors'], data);
    },
  });
  const { mutate: mutateRoutineAnchors } = updateRoutineAnchorsMutation;

  const updateRepetitiveQuestionsMutation = useMutation({
    mutationFn: async (questions: RepetitiveQuestion[]) => {
      await AsyncStorage.setItem(REPETITIVE_QUESTIONS_KEY, JSON.stringify(questions));
      return questions;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['repetitiveQuestions'], data);
    },
  });
  const { mutate: mutateRepetitiveQuestions } = updateRepetitiveQuestionsMutation;

  const settings = useMemo(() => settingsQuery.data, [settingsQuery.data]);
  const emergencyContacts = useMemo(() => contactsQuery.data || [], [contactsQuery.data]);
  const medications = useMemo(() => medicationsQuery.data || [], [medicationsQuery.data]);
  const memoryJournal = useMemo(() => journalQuery.data || [], [journalQuery.data]);
  const safeZones = useMemo(() => safeZonesQuery.data || [], [safeZonesQuery.data]);
  const routineAnchors = useMemo(() => routineAnchorsQuery.data || [], [routineAnchorsQuery.data]);
  const repetitiveQuestions = useMemo(() => repetitiveQuestionsQuery.data || [], [repetitiveQuestionsQuery.data]);

  const updateSettings = useCallback((updates: Partial<DementiaSettings>) => {
    if (!settings) return;
    mutateSettings({ ...settings, ...updates });
  }, [settings, mutateSettings]);

  const addEmergencyContact = useCallback((contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: Date.now().toString(),
    };
    mutateContacts([...emergencyContacts, newContact]);
  }, [emergencyContacts, mutateContacts]);

  const updateEmergencyContact = useCallback((id: string, updates: Partial<EmergencyContact>) => {
    const updated = emergencyContacts.map(c => c.id === id ? { ...c, ...updates } : c);
    mutateContacts(updated);
  }, [emergencyContacts, mutateContacts]);

  const deleteEmergencyContact = useCallback((id: string) => {
    mutateContacts(emergencyContacts.filter(c => c.id !== id));
  }, [emergencyContacts, mutateContacts]);

  const addMedication = useCallback((medication: Omit<MedicationReminder, 'id' | 'missedDoses'>) => {
    const newMedication: MedicationReminder = {
      ...medication,
      id: Date.now().toString(),
      missedDoses: 0,
    };
    mutateMedications([...medications, newMedication]);
  }, [medications, mutateMedications]);

  const updateMedication = useCallback((id: string, updates: Partial<MedicationReminder>) => {
    const updated = medications.map(m => m.id === id ? { ...m, ...updates } : m);
    mutateMedications(updated);
  }, [medications, mutateMedications]);

  const deleteMedication = useCallback((id: string) => {
    mutateMedications(medications.filter(m => m.id !== id));
  }, [medications, mutateMedications]);

  const recordMedicationTaken = useCallback((id: string) => {
    const updated = medications.map(m => 
      m.id === id ? { ...m, lastTaken: new Date().toISOString(), missedDoses: 0 } : m
    );
    mutateMedications(updated);
  }, [medications, mutateMedications]);

  const addJournalEntry = useCallback((entry: Omit<MemoryJournalEntry, 'id'>) => {
    const newEntry: MemoryJournalEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    mutateJournal([newEntry, ...memoryJournal]);
  }, [memoryJournal, mutateJournal]);

  const updateJournalEntry = useCallback((id: string, updates: Partial<MemoryJournalEntry>) => {
    const updated = memoryJournal.map(e => e.id === id ? { ...e, ...updates } : e);
    mutateJournal(updated);
  }, [memoryJournal, mutateJournal]);

  const deleteJournalEntry = useCallback((id: string) => {
    mutateJournal(memoryJournal.filter(e => e.id !== id));
  }, [memoryJournal, mutateJournal]);

  const addSafeZone = useCallback((zone: Omit<SafeZone, 'id'>) => {
    const newZone: SafeZone = {
      ...zone,
      id: Date.now().toString(),
    };
    mutateSafeZones([...safeZones, newZone]);
  }, [safeZones, mutateSafeZones]);

  const updateSafeZone = useCallback((id: string, updates: Partial<SafeZone>) => {
    const updated = safeZones.map(z => z.id === id ? { ...z, ...updates } : z);
    mutateSafeZones(updated);
  }, [safeZones, mutateSafeZones]);

  const deleteSafeZone = useCallback((id: string) => {
    mutateSafeZones(safeZones.filter(z => z.id !== id));
  }, [safeZones, mutateSafeZones]);

  const addRoutineAnchor = useCallback((anchor: Omit<DailyRoutineAnchor, 'id'>) => {
    const newAnchor: DailyRoutineAnchor = {
      ...anchor,
      id: Date.now().toString(),
    };
    mutateRoutineAnchors([...routineAnchors, newAnchor]);
  }, [routineAnchors, mutateRoutineAnchors]);

  const updateRoutineAnchor = useCallback((id: string, updates: Partial<DailyRoutineAnchor>) => {
    const updated = routineAnchors.map(a => a.id === id ? { ...a, ...updates } : a);
    mutateRoutineAnchors(updated);
  }, [routineAnchors, mutateRoutineAnchors]);

  const deleteRoutineAnchor = useCallback((id: string) => {
    mutateRoutineAnchors(routineAnchors.filter(a => a.id !== id));
  }, [routineAnchors, mutateRoutineAnchors]);

  const recordRepetitiveQuestion = useCallback((question: string, answer: string, photoUri?: string) => {
    const existing = repetitiveQuestions.find(q => q.question.toLowerCase() === question.toLowerCase());
    
    if (existing) {
      const updated = repetitiveQuestions.map(q =>
        q.question.toLowerCase() === question.toLowerCase()
          ? { ...q, askedCount: q.askedCount + 1, lastAsked: new Date().toISOString() }
          : q
      );
      mutateRepetitiveQuestions(updated);
    } else {
      const newQuestion: RepetitiveQuestion = {
        question,
        answer,
        askedCount: 1,
        lastAsked: new Date().toISOString(),
        photoUri,
      };
      mutateRepetitiveQuestions([...repetitiveQuestions, newQuestion]);
    }
  }, [repetitiveQuestions, mutateRepetitiveQuestions]);

  const getOrientationInfo = useCallback((): OrientationInfo => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return {
      date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      dayOfWeek: days[now.getDay()],
    };
  }, []);

  const getUpcomingMedications = useCallback(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return medications.filter(med => {
      return med.times.some(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const medTime = hours * 60 + minutes;
        return medTime > currentTime && medTime - currentTime <= 60;
      });
    }).sort((a, b) => {
      const aNextTime = a.times.find(time => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes > currentTime;
      });
      const bNextTime = b.times.find(time => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes > currentTime;
      });
      if (!aNextTime) return 1;
      if (!bNextTime) return -1;
      return aNextTime.localeCompare(bNextTime);
    });
  }, [medications]);

  const getTodayRoutineAnchors = useCallback(() => {
    const today = new Date().getDay();
    return routineAnchors
      .filter(anchor => anchor.isRecurring && anchor.daysOfWeek.includes(today))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [routineAnchors]);

  return useMemo(() => ({
    settings,
    emergencyContacts,
    medications,
    memoryJournal,
    safeZones,
    routineAnchors,
    repetitiveQuestions,
    isLoading: settingsQuery.isLoading,
    updateSettings,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    addMedication,
    updateMedication,
    deleteMedication,
    recordMedicationTaken,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    addSafeZone,
    updateSafeZone,
    deleteSafeZone,
    addRoutineAnchor,
    updateRoutineAnchor,
    deleteRoutineAnchor,
    recordRepetitiveQuestion,
    getOrientationInfo,
    getUpcomingMedications,
    getTodayRoutineAnchors,
  }), [
    settings,
    emergencyContacts,
    medications,
    memoryJournal,
    safeZones,
    routineAnchors,
    repetitiveQuestions,
    settingsQuery.isLoading,
    updateSettings,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    addMedication,
    updateMedication,
    deleteMedication,
    recordMedicationTaken,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    addSafeZone,
    updateSafeZone,
    deleteSafeZone,
    addRoutineAnchor,
    updateRoutineAnchor,
    deleteRoutineAnchor,
    recordRepetitiveQuestion,
    getOrientationInfo,
    getUpcomingMedications,
    getTodayRoutineAnchors,
  ]);
});
