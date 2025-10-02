import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { UserProfile, UserPreference, UserHabit, UserInteraction } from '@/types/userProfile';

const USER_PROFILE_KEY = '@neuronexa_user_profile';

async function loadUserProfile(): Promise<UserProfile> {
  try {
    const stored = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    const defaultProfile: UserProfile = {
      userId: Date.now().toString(),
      preferences: [],
      habits: [],
      interactions: [],
      communicationStyle: 'encouraging',
      motivationTriggers: [],
      avoidTopics: [],
      favoriteEncouragements: [],
      termsAcceptedAt: undefined,
      termsVersion: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  } catch (error) {
    console.error('[UserProfile] Error loading profile:', error);
    return {
      userId: Date.now().toString(),
      preferences: [],
      habits: [],
      interactions: [],
      communicationStyle: 'encouraging',
      motivationTriggers: [],
      avoidTopics: [],
      favoriteEncouragements: [],
      termsAcceptedAt: undefined,
      termsVersion: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

async function saveUserProfile(profile: UserProfile): Promise<UserProfile> {
  try {
    const updated = { ...profile, updatedAt: new Date().toISOString() };
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('[UserProfile] Error saving profile:', error);
    throw error;
  }
}

export const [UserProfileProvider, useUserProfile] = createContextHook(() => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['userProfile'],
    queryFn: loadUserProfile,
  });

  const saveMutation = useMutation({
    mutationFn: saveUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data);
    },
  });

  const { mutate: mutateProfile } = saveMutation;
  const profile = useMemo(() => profileQuery.data, [profileQuery.data]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    if (!profile) return;
    mutateProfile({ ...profile, ...updates });
  }, [profile, mutateProfile]);

  const learnPreference = useCallback((
    category: UserPreference['category'],
    preference: string,
    strength: number = 1
  ) => {
    if (!profile) return;

    const existing = profile.preferences.find(
      p => p.category === category && p.preference === preference
    );

    let updatedPreferences: UserPreference[];

    if (existing) {
      updatedPreferences = profile.preferences.map(p =>
        p.id === existing.id
          ? {
              ...p,
              strength: Math.min(10, p.strength + strength),
              lastReinforced: new Date().toISOString(),
            }
          : p
      );
    } else {
      const newPreference: UserPreference = {
        id: Date.now().toString(),
        category,
        preference,
        strength,
        learnedAt: new Date().toISOString(),
      };
      updatedPreferences = [...profile.preferences, newPreference];
    }

    updateProfile({ preferences: updatedPreferences });
    console.log('[Nexa] Learned preference:', category, preference);
  }, [profile, updateProfile]);

  const recordHabit = useCallback((pattern: string) => {
    if (!profile) return;

    const existing = profile.habits.find(h => h.pattern === pattern);

    let updatedHabits: UserHabit[];

    if (existing) {
      updatedHabits = profile.habits.map(h =>
        h.pattern === pattern
          ? {
              ...h,
              frequency: h.frequency + 1,
              lastObserved: new Date().toISOString(),
              confidence: Math.min(1, h.confidence + 0.1),
            }
          : h
      );
    } else {
      const newHabit: UserHabit = {
        id: Date.now().toString(),
        pattern,
        frequency: 1,
        lastObserved: new Date().toISOString(),
        confidence: 0.3,
      };
      updatedHabits = [...profile.habits, newHabit];
    }

    updateProfile({ habits: updatedHabits });
    console.log('[Nexa] Recorded habit:', pattern);
  }, [profile, updateProfile]);

  const recordInteraction = useCallback((
    type: UserInteraction['type'],
    sentiment?: UserInteraction['sentiment'],
    metadata?: Record<string, any>
  ) => {
    if (!profile) return;

    const interaction: UserInteraction = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type,
      sentiment,
      metadata,
    };

    const updatedInteractions = [interaction, ...profile.interactions].slice(0, 100);
    updateProfile({ interactions: updatedInteractions });

    if (type === 'task_completed' && sentiment === 'positive') {
      learnPreference('motivation', 'completion_celebration', 0.5);
    }

    if (type === 'task_abandoned') {
      const hour = new Date().getHours();
      if (hour >= 20) {
        recordHabit('struggles_evening_tasks');
      }
    }
  }, [profile, updateProfile, learnPreference, recordHabit]);

  const getPreferencesByCategory = useCallback((category: UserPreference['category']) => {
    if (!profile) return [];
    return profile.preferences
      .filter(p => p.category === category)
      .sort((a, b) => b.strength - a.strength);
  }, [profile]);

  const getStrongHabits = useCallback((minConfidence: number = 0.5) => {
    if (!profile) return [];
    return profile.habits
      .filter(h => h.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence);
  }, [profile]);

  const setCommunicationStyle = useCallback((style: UserProfile['communicationStyle']) => {
    updateProfile({ communicationStyle: style });
    learnPreference('communication', `prefers_${style}_style`, 2);
  }, [updateProfile, learnPreference]);

  const addFavoriteEncouragement = useCallback((encouragement: string) => {
    if (!profile) return;
    if (!profile.favoriteEncouragements.includes(encouragement)) {
      updateProfile({
        favoriteEncouragements: [...profile.favoriteEncouragements, encouragement],
      });
    }
  }, [profile, updateProfile]);

  const addAvoidTopic = useCallback((topic: string) => {
    if (!profile) return;
    if (!profile.avoidTopics.includes(topic)) {
      updateProfile({
        avoidTopics: [...profile.avoidTopics, topic],
      });
    }
  }, [profile, updateProfile]);

  return useMemo(() => ({
    profile,
    isLoading: profileQuery.isLoading,
    updateProfile,
    learnPreference,
    recordHabit,
    recordInteraction,
    getPreferencesByCategory,
    getStrongHabits,
    setCommunicationStyle,
    addFavoriteEncouragement,
    addAvoidTopic,
  }), [
    profile,
    profileQuery.isLoading,
    updateProfile,
    learnPreference,
    recordHabit,
    recordInteraction,
    getPreferencesByCategory,
    getStrongHabits,
    setCommunicationStyle,
    addFavoriteEncouragement,
    addAvoidTopic,
  ]);
});
