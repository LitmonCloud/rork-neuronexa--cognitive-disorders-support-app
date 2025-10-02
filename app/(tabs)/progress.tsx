import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTasks } from '@/contexts/TaskContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useRetention } from '@/contexts/RetentionContext';
import { useTheme } from '@/contexts/ThemeContext';
import { CheckCircle, Clock, TrendingUp, RefreshCw, AlertCircle, Flame, Award, Lock } from 'lucide-react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function ProgressScreen() {
  const { allTasks } = useTasks();
  const { settings } = useAccessibility();
  const { streak, unlockedAchievements, lockedAchievements, updateTaskAchievements } = useRetention();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const completedTasks = allTasks.filter(t => t.status === 'completed');
  const inProgressTasks = allTasks.filter(t => t.status === 'in-progress');
  const pendingTasks = allTasks.filter(t => t.status === 'pending');

  const completionRate = allTasks.length > 0 
    ? Math.round((completedTasks.length / allTasks.length) * 100) 
    : 0;

  const textSize = settings.largeText ? 1.2 : 1;

  useEffect(() => {
    updateTaskAchievements(completedTasks.length);
  }, [completedTasks.length, updateTaskAchievements]);

  const tasksNeedingAttention = allTasks.filter(task => {
    if (task.status === 'completed') return false;
    const incompletedSteps = task.steps.filter(s => !s.completed);
    return incompletedSteps.length > 0;
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    header: {
      marginBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 2,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    statNumber: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    streakCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 2,
    },
    streakHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    streakIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.warning + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    streakContent: {
      flex: 1,
    },
    streakNumber: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: colors.text,
    },
    streakLabel: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    streakBest: {
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.primaryLight + '20',
      borderRadius: 12,
    },
    streakBestNumber: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.primary,
    },
    streakBestLabel: {
      fontSize: 11,
      color: colors.primary,
      textTransform: 'uppercase' as const,
    },
    streakDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    encouragementCard: {
      backgroundColor: colors.primaryLight + '30',
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.primaryLight,
    },
    encouragementTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.primaryDark,
      marginBottom: 8,
    },
    encouragementText: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    reminderCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    reminderTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8,
    },
    reminderText: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    section: {
      marginTop: 16,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    tasksList: {
      gap: 12,
    },
    attentionCard: {
      backgroundColor: colors.warning + '10',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.warning + '30',
    },
    attentionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    attentionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.warning + '20',
      alignItems: 'center',
      justifyContent: 'center',
    },
    attentionContent: {
      flex: 1,
    },
    attentionTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 4,
    },
    attentionText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    achievementsList: {
      gap: 12,
    },
    achievementCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primaryLight + '20',
      borderRadius: 12,
      padding: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.primaryLight,
    },
    achievementCardLocked: {
      backgroundColor: colors.surfaceTint,
      borderColor: colors.border,
      opacity: 0.7,
    },
    achievementIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
    },
    achievementIconLocked: {
      backgroundColor: colors.borderLight,
    },
    achievementContent: {
      flex: 1,
    },
    achievementTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 4,
    },
    achievementDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      overflow: 'hidden' as const,
      marginBottom: 4,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
    progressText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Keep up the great work!</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
              <CheckCircle size={32} color={colors.success} />
            </View>
            <Text style={styles.statNumber}>{completedTasks.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
              <Clock size={32} color={colors.warning} />
            </View>
            <Text style={styles.statNumber}>{inProgressTasks.length}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <TrendingUp size={32} color={colors.primary} />
            </View>
            <Text style={styles.statNumber}>{completionRate}%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>

        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <View style={styles.streakIconContainer}>
              <Flame size={32} color={streak.current > 0 ? colors.warning : colors.textLight} />
            </View>
            <View style={styles.streakContent}>
              <Text style={styles.streakNumber}>{streak.current} Day{streak.current !== 1 ? 's' : ''}</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
            <View style={styles.streakBest}>
              <Text style={styles.streakBestNumber}>{streak.longest}</Text>
              <Text style={styles.streakBestLabel}>Best</Text>
            </View>
          </View>
          <Text style={styles.streakDescription}>
            {streak.current === 0 
              ? "Complete a task today to start your streak!"
              : streak.current === 1
              ? "Great start! Complete another task tomorrow to keep it going."
              : `Amazing! You've completed tasks ${streak.current} days in a row!`}
          </Text>
        </View>

        <View style={styles.encouragementCard}>
          <Text style={styles.encouragementTitle}>You&apos;re doing amazing!</Text>
          <Text style={styles.encouragementText}>
            {completedTasks.length === 0 
              ? "Start your first task today. Every journey begins with a single step."
              : completedTasks.length < 5
              ? "You&apos;ve completed your first tasks! Keep building momentum."
              : "You&apos;re building great habits. Be proud of your progress!"}
          </Text>
        </View>

        {unlockedAchievements.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Award size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { fontSize: 18 * textSize }]}>
                Achievements ({unlockedAchievements.length})
              </Text>
            </View>
            <View style={styles.achievementsList}>
              {unlockedAchievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementCard}>
                  <View style={styles.achievementIcon}>
                    <Award size={24} color={colors.primary} />
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={[styles.achievementTitle, { fontSize: 16 * textSize }]}>
                      {achievement.title}
                    </Text>
                    <Text style={[styles.achievementDescription, { fontSize: 13 * textSize }]}>
                      {achievement.description}
                    </Text>
                  </View>
                  <CheckCircle size={20} color={colors.success} />
                </View>
              ))}
            </View>
          </View>
        )}

        {lockedAchievements.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Lock size={20} color={colors.textSecondary} />
              <Text style={[styles.sectionTitle, { fontSize: 18 * textSize, color: colors.textSecondary }]}>
                Locked Achievements
              </Text>
            </View>
            <View style={styles.achievementsList}>
              {lockedAchievements.slice(0, 3).map((achievement) => (
                <View key={achievement.id} style={[styles.achievementCard, styles.achievementCardLocked]}>
                  <View style={[styles.achievementIcon, styles.achievementIconLocked]}>
                    <Lock size={20} color={colors.textLight} />
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={[styles.achievementTitle, { fontSize: 16 * textSize, color: colors.textSecondary }]}>
                      {achievement.title}
                    </Text>
                    <Text style={[styles.achievementDescription, { fontSize: 13 * textSize }]}>
                      {achievement.description}
                    </Text>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.progressText, { fontSize: 12 * textSize }]}>
                      {achievement.progress}/{achievement.target}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {pendingTasks.length > 0 && (
          <View style={styles.reminderCard}>
            <Text style={[styles.reminderTitle, { fontSize: 18 * textSize }]}>Gentle Reminder</Text>
            <Text style={[styles.reminderText, { fontSize: 15 * textSize }]}>
              You have {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} waiting. 
              Take your time and start when you&apos;re ready.
            </Text>
          </View>
        )}

        {settings.cognitiveMode && tasksNeedingAttention.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <RefreshCw size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { fontSize: 18 * textSize }]}>
                Tasks Needing Attention
              </Text>
            </View>
            <Text style={[styles.sectionSubtitle, { fontSize: 14 * textSize }]}>
              These tasks have steps waiting to be completed. Take them one at a time.
            </Text>
            
            <View style={styles.tasksList}>
              {tasksNeedingAttention.slice(0, 3).map((task) => {
                const incompletedSteps = task.steps.filter(s => !s.completed).length;
                return (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.attentionCard}
                    onPress={() => router.push(`/task/${task.id}` as any)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.attentionLeft}>
                      <View style={styles.attentionIcon}>
                        <AlertCircle size={24} color={colors.warning} />
                      </View>
                      <View style={styles.attentionContent}>
                        <Text style={[styles.attentionTitle, { fontSize: 16 * textSize }]}>
                          {task.title}
                        </Text>
                        <Text style={[styles.attentionText, { fontSize: 13 * textSize }]}>
                          {incompletedSteps} step{incompletedSteps !== 1 ? 's' : ''} remaining
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}


