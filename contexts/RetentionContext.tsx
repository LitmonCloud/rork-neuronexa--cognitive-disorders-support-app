import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { Streak, Achievement, ACHIEVEMENTS } from '@/types/retention';

const STREAK_KEY = '@nexa_streak';
const ACHIEVEMENTS_KEY = '@nexa_achievements';

async function loadStreak(): Promise<Streak> {
  try {
    const stored = await AsyncStorage.getItem(STREAK_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      current: 0,
      longest: 0,
      lastCompletionDate: '',
    };
  } catch (error) {
    console.error('Error loading streak:', error);
    return {
      current: 0,
      longest: 0,
      lastCompletionDate: '',
    };
  }
}

async function saveStreak(streak: Streak): Promise<Streak> {
  try {
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(streak));
    return streak;
  } catch (error) {
    console.error('Error saving streak:', error);
    throw error;
  }
}

async function loadAchievements(): Promise<Achievement[]> {
  try {
    const stored = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return ACHIEVEMENTS.map(a => ({ ...a, progress: 0, unlockedAt: undefined }));
  } catch (error) {
    console.error('Error loading achievements:', error);
    return ACHIEVEMENTS.map(a => ({ ...a, progress: 0, unlockedAt: undefined }));
  }
}

async function saveAchievements(achievements: Achievement[]): Promise<Achievement[]> {
  try {
    await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    return achievements;
  } catch (error) {
    console.error('Error saving achievements:', error);
    throw error;
  }
}

export const [RetentionProvider, useRetention] = createContextHook(() => {
  const queryClient = useQueryClient();

  const streakQuery = useQuery({
    queryKey: ['streak'],
    queryFn: loadStreak,
  });

  const achievementsQuery = useQuery({
    queryKey: ['achievements'],
    queryFn: loadAchievements,
  });

  const streakMutation = useMutation({
    mutationFn: saveStreak,
    onSuccess: (data) => {
      queryClient.setQueryData(['streak'], data);
    },
  });

  const achievementsMutation = useMutation({
    mutationFn: saveAchievements,
    onSuccess: (data) => {
      queryClient.setQueryData(['achievements'], data);
    },
  });

  const { mutate: mutateStreak } = streakMutation;
  const { mutate: mutateAchievements } = achievementsMutation;

  const streak = useMemo(() => streakQuery.data || {
    current: 0,
    longest: 0,
    lastCompletionDate: '',
  }, [streakQuery.data]);

  const achievements = useMemo(() => achievementsQuery.data || 
    ACHIEVEMENTS.map(a => ({ ...a, progress: 0, unlockedAt: undefined })), 
    [achievementsQuery.data]
  );

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const lastDate = streak.lastCompletionDate ? new Date(streak.lastCompletionDate).toDateString() : '';
    
    if (lastDate === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newCurrent = 1;
    if (lastDate === yesterdayStr) {
      newCurrent = streak.current + 1;
    }

    const newStreak: Streak = {
      current: newCurrent,
      longest: Math.max(newCurrent, streak.longest),
      lastCompletionDate: new Date().toISOString(),
    };

    mutateStreak(newStreak);

    const updatedAchievements = achievements.map(achievement => {
      if (achievement.id.startsWith('streak_')) {
        const target = parseInt(achievement.id.split('_')[1]);
        if (newCurrent >= target && !achievement.unlockedAt) {
          return {
            ...achievement,
            progress: newCurrent,
            unlockedAt: new Date().toISOString(),
          };
        }
        return {
          ...achievement,
          progress: newCurrent,
        };
      }
      return achievement;
    });

    mutateAchievements(updatedAchievements);
  }, [streak, achievements, mutateStreak, mutateAchievements]);

  const updateTaskAchievements = useCallback((completedCount: number) => {
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.id.includes('task')) {
        if (completedCount >= achievement.target && !achievement.unlockedAt) {
          return {
            ...achievement,
            progress: completedCount,
            unlockedAt: new Date().toISOString(),
          };
        }
        return {
          ...achievement,
          progress: completedCount,
        };
      }
      return achievement;
    });

    mutateAchievements(updatedAchievements);
  }, [achievements, mutateAchievements]);

  const unlockedAchievements = useMemo(() => 
    achievements.filter(a => a.unlockedAt),
    [achievements]
  );

  const lockedAchievements = useMemo(() => 
    achievements.filter(a => !a.unlockedAt),
    [achievements]
  );

  return useMemo(() => ({
    streak,
    achievements,
    unlockedAchievements,
    lockedAchievements,
    updateStreak,
    updateTaskAchievements,
    isLoading: streakQuery.isLoading || achievementsQuery.isLoading,
  }), [
    streak,
    achievements,
    unlockedAchievements,
    lockedAchievements,
    updateStreak,
    updateTaskAchievements,
    streakQuery.isLoading,
    achievementsQuery.isLoading,
  ]);
});
