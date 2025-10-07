import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { Recommendation } from '@/types/recommendation';
import { RecommendationEngine } from '@/services/recommendations/RecommendationEngine';
import { useUserProfile } from './UserProfileContext';
import { useTasks } from './TaskContext';

const RECOMMENDATIONS_KEY = '@nexa_recommendations';
const DISMISSED_KEY = '@nexa_dismissed_recommendations';

async function loadRecommendations(): Promise<Recommendation[]> {
  try {
    const stored = await AsyncStorage.getItem(RECOMMENDATIONS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('[Recommendations] Error loading:', error);
    return [];
  }
}

async function saveRecommendations(recommendations: Recommendation[]): Promise<Recommendation[]> {
  try {
    await AsyncStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(recommendations));
    return recommendations;
  } catch (error) {
    console.error('[Recommendations] Error saving:', error);
    throw error;
  }
}

async function loadDismissed(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem(DISMISSED_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('[Recommendations] Error loading dismissed:', error);
    return [];
  }
}

async function saveDismissed(dismissed: string[]): Promise<string[]> {
  try {
    await AsyncStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
    return dismissed;
  } catch (error) {
    console.error('[Recommendations] Error saving dismissed:', error);
    throw error;
  }
}

export const [RecommendationProvider, useRecommendations] = createContextHook(() => {
  const queryClient = useQueryClient();
  const { profile } = useUserProfile();
  const { allTasks } = useTasks();

  const recommendationsQuery = useQuery({
    queryKey: ['recommendations'],
    queryFn: loadRecommendations,
    staleTime: 5 * 60 * 1000,
  });

  const dismissedQuery = useQuery({
    queryKey: ['dismissedRecommendations'],
    queryFn: loadDismissed,
    staleTime: 30 * 60 * 1000,
  });

  const saveMutation = useMutation({
    mutationFn: saveRecommendations,
    onSuccess: (data) => {
      queryClient.setQueryData(['recommendations'], data);
    },
  });

  const dismissMutation = useMutation({
    mutationFn: saveDismissed,
    onSuccess: (data) => {
      queryClient.setQueryData(['dismissedRecommendations'], data);
    },
  });

  const { mutate: saveRecommendationsMutate } = saveMutation;
  const { mutate: saveDismissedMutate } = dismissMutation;

  const recommendations = useMemo(() => recommendationsQuery.data || [], [recommendationsQuery.data]);
  const dismissed = useMemo(() => dismissedQuery.data || [], [dismissedQuery.data]);

  const activeRecommendations = useMemo(() => 
    recommendations.filter(rec => 
      !rec.dismissed && 
      !rec.completed &&
      !dismissed.includes(rec.id) &&
      (!rec.expiresAt || new Date(rec.expiresAt) > new Date())
    ),
    [recommendations, dismissed]
  );

  const refreshRecommendations = useCallback(async () => {
    if (!profile) return;

    console.log('[Recommendations] Generating new recommendations');
    const newRecommendations = RecommendationEngine.generateRecommendations(
      profile,
      allTasks
    );

    const existingIds = new Set(recommendations.map(r => r.id));
    const uniqueNew = newRecommendations.filter(r => !existingIds.has(r.id));

    const updated = [...recommendations, ...uniqueNew]
      .filter(rec => !rec.expiresAt || new Date(rec.expiresAt) > new Date())
      .slice(0, 20);

    saveRecommendationsMutate(updated);
    console.log('[Recommendations] Generated', uniqueNew.length, 'new recommendations');
  }, [profile, allTasks, recommendations, saveRecommendationsMutate]);

  const dismissRecommendation = useCallback((id: string) => {
    const updated = recommendations.map(rec =>
      rec.id === id ? { ...rec, dismissed: true } : rec
    );
    saveRecommendationsMutate(updated);
    saveDismissedMutate([...dismissed, id]);
    console.log('[Recommendations] Dismissed:', id);
  }, [recommendations, dismissed, saveRecommendationsMutate, saveDismissedMutate]);

  const completeRecommendation = useCallback((id: string) => {
    const updated = recommendations.map(rec =>
      rec.id === id ? { ...rec, completed: true } : rec
    );
    saveRecommendationsMutate(updated);
    console.log('[Recommendations] Completed:', id);
  }, [recommendations, saveRecommendationsMutate]);

  const clearDismissed = useCallback(() => {
    saveDismissedMutate([]);
    console.log('[Recommendations] Cleared dismissed list');
  }, [saveDismissedMutate]);

  useEffect(() => {
    if (profile && allTasks.length > 0 && recommendations.length === 0) {
      refreshRecommendations();
    }
  }, [profile, allTasks.length, recommendations.length, refreshRecommendations]);

  return {
    recommendations: activeRecommendations,
    allRecommendations: recommendations,
    isLoading: recommendationsQuery.isLoading,
    refreshRecommendations,
    dismissRecommendation,
    completeRecommendation,
    clearDismissed,
  } as const;
});
