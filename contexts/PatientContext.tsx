import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { Patient, PatientTask } from '@/types/patient';
import { useNotifications } from './NotificationContext';

const PATIENTS_KEY = '@nexa_patients';
const PATIENT_TASKS_KEY = '@nexa_patient_tasks';
const SELECTED_PATIENT_KEY = '@nexa_selected_patient';

async function loadPatients(): Promise<Patient[]> {
  try {
    const stored = await AsyncStorage.getItem(PATIENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading patients:', error);
    return [];
  }
}

async function savePatients(patients: Patient[]): Promise<Patient[]> {
  try {
    await AsyncStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
    return patients;
  } catch (error) {
    console.error('Error saving patients:', error);
    throw error;
  }
}

async function loadPatientTasks(): Promise<PatientTask[]> {
  try {
    const stored = await AsyncStorage.getItem(PATIENT_TASKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading patient tasks:', error);
    return [];
  }
}

async function savePatientTasks(patientTasks: PatientTask[]): Promise<PatientTask[]> {
  try {
    await AsyncStorage.setItem(PATIENT_TASKS_KEY, JSON.stringify(patientTasks));
    return patientTasks;
  } catch (error) {
    console.error('Error saving patient tasks:', error);
    throw error;
  }
}

async function loadSelectedPatient(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(SELECTED_PATIENT_KEY);
  } catch (error) {
    console.error('Error loading selected patient:', error);
    return null;
  }
}

async function saveSelectedPatient(patientId: string | null): Promise<string | null> {
  try {
    if (patientId) {
      await AsyncStorage.setItem(SELECTED_PATIENT_KEY, patientId);
    } else {
      await AsyncStorage.removeItem(SELECTED_PATIENT_KEY);
    }
    return patientId;
  } catch (error) {
    console.error('Error saving selected patient:', error);
    throw error;
  }
}

const PROFILE_COLORS = [
  '#7b61ff',
  '#ff6b9d',
  '#4ecdc4',
  '#ffd93d',
  '#ff8c42',
  '#6bcf7f',
  '#a78bfa',
  '#fb7185',
];

export const [PatientProvider, usePatients] = createContextHook(() => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const patientsQuery = useQuery({
    queryKey: ['patients'],
    queryFn: loadPatients,
  });

  const patientTasksQuery = useQuery({
    queryKey: ['patient-tasks'],
    queryFn: loadPatientTasks,
  });

  const selectedPatientQuery = useQuery({
    queryKey: ['selected-patient'],
    queryFn: loadSelectedPatient,
  });

  const savePatientsMutation = useMutation({
    mutationFn: savePatients,
    onSuccess: (data) => {
      queryClient.setQueryData(['patients'], data);
    },
  });

  const savePatientTasksMutation = useMutation({
    mutationFn: savePatientTasks,
    onSuccess: (data) => {
      queryClient.setQueryData(['patient-tasks'], data);
    },
  });

  const saveSelectedPatientMutation = useMutation({
    mutationFn: saveSelectedPatient,
    onSuccess: (data) => {
      queryClient.setQueryData(['selected-patient'], data);
    },
  });

  const { mutate: mutatePatients, mutateAsync: mutatePatientsAsync } = savePatientsMutation;
  const { mutate: mutatePatientTasks } = savePatientTasksMutation;
  const { mutate: mutateSelectedPatient } = saveSelectedPatientMutation;

  const patients = useMemo(() => patientsQuery.data || [], [patientsQuery.data]);
  const patientTasks = useMemo(() => patientTasksQuery.data || [], [patientTasksQuery.data]);
  const selectedPatientId = useMemo(() => selectedPatientQuery.data || null, [selectedPatientQuery.data]);

  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId) || null;
  }, [patients, selectedPatientId]);

  const addPatient = useCallback(async (
    firstName: string,
    lastNameInitial: string,
    caregiverId: string
  ) => {
    const colorIndex = patients.length % PROFILE_COLORS.length;
    const newPatient: Patient = {
      id: Date.now().toString(),
      firstName,
      lastNameInitial,
      caregiverId,
      createdAt: new Date().toISOString(),
      profileColor: PROFILE_COLORS[colorIndex],
    };

    const updated = [...patients, newPatient];
    await mutatePatientsAsync(updated);
    console.log('[PatientContext] Patient added:', newPatient.firstName);
    return newPatient;
  }, [patients, mutatePatientsAsync]);

  const updatePatient = useCallback((patientId: string, updates: Partial<Patient>) => {
    const updated = patients.map(p =>
      p.id === patientId ? { ...p, ...updates } : p
    );
    mutatePatients(updated);
  }, [patients, mutatePatients]);

  const deletePatient = useCallback((patientId: string) => {
    const updated = patients.filter(p => p.id !== patientId);
    mutatePatients(updated);

    const updatedTasks = patientTasks.filter(pt => pt.patientId !== patientId);
    mutatePatientTasks(updatedTasks);

    if (selectedPatientId === patientId) {
      mutateSelectedPatient(null);
    }
  }, [patients, patientTasks, selectedPatientId, mutatePatients, mutatePatientTasks, mutateSelectedPatient]);

  const selectPatient = useCallback((patientId: string | null) => {
    mutateSelectedPatient(patientId);
  }, [mutateSelectedPatient]);

  const linkTaskToPatient = useCallback((
    patientId: string,
    taskId: string,
    createdBy: 'caregiver' | 'patient'
  ) => {
    const newLink: PatientTask = {
      patientId,
      taskId,
      createdBy,
      createdAt: new Date().toISOString(),
    };

    const updated = [...patientTasks, newLink];
    mutatePatientTasks(updated);

    const patient = patients.find(p => p.id === patientId);
    if (patient && createdBy === 'caregiver') {
      addNotification({
        type: 'task_assigned',
        title: 'Task Assigned',
        message: `New task assigned to ${patient.firstName} ${patient.lastNameInitial}.`,
        priority: 'low',
        category: 'task',
      });
    }
  }, [patientTasks, patients, mutatePatientTasks, addNotification]);

  const unlinkTaskFromPatient = useCallback((taskId: string) => {
    const updated = patientTasks.filter(pt => pt.taskId !== taskId);
    mutatePatientTasks(updated);
  }, [patientTasks, mutatePatientTasks]);

  const updateTaskLink = useCallback((
    taskId: string,
    modifiedBy: 'caregiver' | 'patient'
  ) => {
    const updated = patientTasks.map(pt =>
      pt.taskId === taskId
        ? { ...pt, lastModifiedBy: modifiedBy, lastModifiedAt: new Date().toISOString() }
        : pt
    );
    mutatePatientTasks(updated);
  }, [patientTasks, mutatePatientTasks]);

  const getPatientTasks = useCallback((patientId: string) => {
    return patientTasks.filter(pt => pt.patientId === patientId);
  }, [patientTasks]);

  const getTaskPatient = useCallback((taskId: string) => {
    const link = patientTasks.find(pt => pt.taskId === taskId);
    if (!link) return null;
    return patients.find(p => p.id === link.patientId) || null;
  }, [patientTasks, patients]);

  return useMemo(() => ({
    patients,
    selectedPatient,
    selectedPatientId,
    selectedDate,
    patientTasks,
    isLoading: patientsQuery.isLoading || patientTasksQuery.isLoading,
    addPatient,
    updatePatient,
    deletePatient,
    selectPatient,
    setSelectedDate,
    linkTaskToPatient,
    unlinkTaskFromPatient,
    updateTaskLink,
    getPatientTasks,
    getTaskPatient,
  }), [
    patients,
    selectedPatient,
    selectedPatientId,
    selectedDate,
    patientTasks,
    patientsQuery.isLoading,
    patientTasksQuery.isLoading,
    addPatient,
    updatePatient,
    deletePatient,
    selectPatient,
    linkTaskToPatient,
    unlinkTaskFromPatient,
    updateTaskLink,
    getPatientTasks,
    getTaskPatient,
  ]);
});
