import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Activity,
  CheckCircle2,
  Clock,
  Heart,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  ArrowLeft,
  Brain,
  Target,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontSizes, fontWeights } from '@/theme/typography';
import { useTasks } from '@/contexts/TaskContext';
import { useCaregivers } from '@/contexts/CaregiverContext';
import Card from '@/components/Card';
import PremiumGate from '@/components/PremiumGate';

const { width } = Dimensions.get('window');

export default function CaregiverDashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const { allTasks } = useTasks();
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useCaregivers();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'tasks' | 'wellness' | 'alerts'>('overview');

  const completedTasks = allTasks.filter(t => t.status === 'completed').length;
  const pendingTasks = allTasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = allTasks.filter(t => t.status === 'in-progress').length;

  const recentTasks = allTasks.slice(0, 5);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const mockWellnessData = {
    breathingSessions: 12,
    avgHeartRate: 72,
    stressLevel: 'Moderate',
    sleepQuality: 'Good',
    weeklyProgress: 85,
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <Card style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Activity size={24} color={colors.success} />
          <Text style={styles.statusTitle}>Patient Status</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
          <Text style={styles.statusText}>Active Today</Text>
        </View>
        <Text style={styles.statusSubtext}>Last activity: 15 minutes ago</Text>
      </Card>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <CheckCircle2 size={28} color={colors.success} />
          <Text style={styles.statValue}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </Card>
        <Card style={styles.statCard}>
          <Clock size={28} color={colors.warning} />
          <Text style={styles.statValue}>{inProgressTasks}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </Card>
        <Card style={styles.statCard}>
          <Target size={28} color={colors.primary} />
          <Text style={styles.statValue}>{pendingTasks}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Card>
        <Card style={styles.statCard}>
          <Heart size={28} color={colors.error} />
          <Text style={styles.statValue}>{mockWellnessData.breathingSessions}</Text>
          <Text style={styles.statLabel}>Breathing</Text>
        </Card>
      </View>

      <Card style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Brain size={20} color={colors.primary} />
          <Text style={styles.insightTitle}>AI Insights</Text>
        </View>
        <Text style={styles.insightText}>
          Patient is showing consistent progress with task completion. Stress levels have improved by 12% this week. 
          Consider encouraging more breathing exercises in the evening for better sleep quality.
        </Text>
        <TouchableOpacity style={styles.insightButton}>
          <Text style={styles.insightButtonText}>View Detailed Analysis</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Daily Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tasks Completed:</Text>
          <Text style={styles.summaryValue}>{completedTasks} / {allTasks.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Breathing Sessions:</Text>
          <Text style={styles.summaryValue}>{mockWellnessData.breathingSessions}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Avg Heart Rate:</Text>
          <Text style={styles.summaryValue}>{mockWellnessData.avgHeartRate} bpm</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Stress Level:</Text>
          <Text style={[styles.summaryValue, { color: colors.warning }]}>{mockWellnessData.stressLevel}</Text>
        </View>
      </Card>
    </View>
  );

  const renderTasks = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Patient Tasks</Text>
      <Text style={styles.sectionSubtitle}>Read-only view of current tasks</Text>
      
      {recentTasks.length === 0 ? (
        <Card style={styles.emptyCard}>
          <CheckCircle2 size={48} color={colors.textLight} />
          <Text style={styles.emptyText}>No tasks yet</Text>
        </Card>
      ) : (
        recentTasks.map((task) => (
          <Card key={task.id} style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <View style={styles.taskTitleRow}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={[styles.statusBadgeSmall, getStatusStyle(task.status)]}>
                  <Text style={[styles.statusBadgeText, getStatusTextStyle(task.status)]}>
                    {task.status}
                  </Text>
                </View>
              </View>
              {task.description && (
                <Text style={styles.taskDescription}>{task.description}</Text>
              )}
            </View>
            {task.steps.length > 0 && (
              <View style={styles.taskSteps}>
                <Text style={styles.taskStepsTitle}>
                  Steps: {task.steps.filter(s => s.completed).length} / {task.steps.length}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(task.steps.filter(s => s.completed).length / task.steps.length) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            )}
          </Card>
        ))
      )}
    </View>
  );

  const renderWellness = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Wellness Overview</Text>
      
      <Card style={styles.wellnessCard}>
        <View style={styles.wellnessHeader}>
          <Heart size={24} color={colors.error} />
          <Text style={styles.wellnessTitle}>Heart Rate</Text>
        </View>
        <Text style={styles.wellnessValue}>{mockWellnessData.avgHeartRate} bpm</Text>
        <Text style={styles.wellnessSubtext}>Average this week</Text>
      </Card>

      <Card style={styles.wellnessCard}>
        <View style={styles.wellnessHeader}>
          <TrendingUp size={24} color={colors.primary} />
          <Text style={styles.wellnessTitle}>Weekly Progress</Text>
        </View>
        <Text style={styles.wellnessValue}>{mockWellnessData.weeklyProgress}%</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${mockWellnessData.weeklyProgress}%` }]} />
        </View>
      </Card>

      <Card style={styles.wellnessCard}>
        <View style={styles.wellnessHeader}>
          <Activity size={24} color={colors.success} />
          <Text style={styles.wellnessTitle}>Breathing Sessions</Text>
        </View>
        <Text style={styles.wellnessValue}>{mockWellnessData.breathingSessions}</Text>
        <Text style={styles.wellnessSubtext}>This week</Text>
      </Card>

      <Card style={[styles.insightCard, { marginTop: spacing.lg }]}>
        <View style={styles.insightHeader}>
          <Brain size={20} color={colors.primary} />
          <Text style={styles.insightTitle}>Wellness Insights</Text>
        </View>
        <Text style={styles.insightText}>
          Breathing exercises are helping reduce stress levels. Heart rate variability shows improvement. 
          Encourage continued practice, especially during high-stress periods.
        </Text>
      </Card>
    </View>
  );

  const renderAlerts = () => (
    <View style={styles.tabContent}>
      <View style={styles.alertsHeader}>
        <Text style={styles.sectionTitle}>Updates from Patient</Text>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllNotificationsRead}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {notifications.length === 0 ? (
        <Card style={styles.emptyCard}>
          <AlertCircle size={48} color={colors.textLight} />
          <Text style={styles.emptyText}>No updates yet</Text>
          <Text style={styles.emptySubtext}>You&apos;ll see patient activity here</Text>
        </Card>
      ) : (
        notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            onPress={() => markNotificationRead(notification.id)}
            activeOpacity={0.7}
          >
            <Card style={[
              styles.alertCard,
              !notification.read && styles.unreadCard
            ]}>
              <View style={styles.alertHeader}>
                <View style={styles.alertIconRow}>
                  <AlertCircle
                    size={20}
                    color={
                      notification.severity === 'high' ? colors.error :
                      notification.severity === 'medium' ? colors.warning :
                      colors.success
                    }
                  />
                  {!notification.read && (
                    <View style={styles.unreadDot} />
                  )}
                </View>
                <Text style={styles.alertTime}>{formatTimeAgo(notification.timestamp)}</Text>
              </View>
              <Text style={styles.alertTitle}>{notification.title}</Text>
              <Text style={styles.alertMessage}>{notification.message}</Text>
              {notification.taskTitle && (
                <View style={styles.taskBadge}>
                  <CheckCircle2 size={14} color={colors.primary} />
                  <Text style={styles.taskBadgeText}>{notification.taskTitle}</Text>
                </View>
              )}
            </Card>
          </TouchableOpacity>
        ))
      )}

      <Card style={styles.infoCard}>
        <MessageSquare size={20} color={colors.primary} />
        <Text style={styles.infoTitle}>Communication</Text>
        <Text style={styles.infoText}>
          Send supportive messages or suggestions to help your patient stay on track.
        </Text>
        <TouchableOpacity style={styles.messageButton}>
          <MessageSquare size={16} color={colors.surface} />
          <Text style={styles.messageButtonText}>Send Message</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );

  return (
    <PremiumGate
      feature="Caregiver Dashboard"
      featureDescription="Empower your support network with real-time insights, task monitoring, wellness tracking, and AI-powered recommendations to help you succeed."
    >
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Caregiver Dashboard</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'overview' && styles.tabActive]}
          onPress={() => setSelectedTab('overview')}
        >
          <Activity size={20} color={selectedTab === 'overview' ? colors.primary : colors.textLight} />
          <Text style={[styles.tabText, selectedTab === 'overview' && styles.tabTextActive]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'tasks' && styles.tabActive]}
          onPress={() => setSelectedTab('tasks')}
        >
          <CheckCircle2 size={20} color={selectedTab === 'tasks' ? colors.primary : colors.textLight} />
          <Text style={[styles.tabText, selectedTab === 'tasks' && styles.tabTextActive]}>
            Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'wellness' && styles.tabActive]}
          onPress={() => setSelectedTab('wellness')}
        >
          <Heart size={20} color={selectedTab === 'wellness' ? colors.primary : colors.textLight} />
          <Text style={[styles.tabText, selectedTab === 'wellness' && styles.tabTextActive]}>
            Wellness
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'alerts' && styles.tabActive]}
          onPress={() => setSelectedTab('alerts')}
        >
          <View style={styles.tabIconContainer}>
            <AlertCircle size={20} color={selectedTab === 'alerts' ? colors.primary : colors.textLight} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.tabText, selectedTab === 'alerts' && styles.tabTextActive]}>
            Updates
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'tasks' && renderTasks()}
        {selectedTab === 'wellness' && renderWellness()}
        {selectedTab === 'alerts' && renderAlerts()}
      </ScrollView>
    </View>
    </PremiumGate>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'completed':
      return { backgroundColor: colors.success + '20' };
    case 'in-progress':
      return { backgroundColor: colors.warning + '20' };
    default:
      return { backgroundColor: colors.textLight + '20' };
  }
}

function getStatusTextStyle(status: string) {
  switch (status) {
    case 'completed':
      return { color: colors.success };
    case 'in-progress':
      return { color: colors.warning };
    default:
      return { color: colors.textSecondary };
  }
}

function getSeverityStyle(severity: string) {
  switch (severity) {
    case 'high':
      return { backgroundColor: colors.error + '20' };
    case 'medium':
      return { backgroundColor: colors.warning + '20' };
    default:
      return { backgroundColor: colors.success + '20' };
  }
}

function getSeverityTextStyle(severity: string) {
  switch (severity) {
    case 'high':
      return { color: colors.error };
    case 'medium':
      return { color: colors.warning };
    default:
      return { color: colors.success };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: 4,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: fontSizes.xs,
    color: colors.textLight,
    fontWeight: fontWeights.medium,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: fontWeights.bold,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  tabContent: {
    gap: spacing.lg,
  },
  statusCard: {
    padding: spacing.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statusTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  statusSubtext: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap' as const,
    gap: spacing.md,
  },
  statCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  statValue: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  insightCard: {
    padding: spacing.lg,
    backgroundColor: colors.primaryLight + '15',
    borderColor: colors.primaryLight,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  insightTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  insightText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  insightButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
  },
  insightButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
  summaryCard: {
    padding: spacing.lg,
  },
  summaryTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xxxl,
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.textLight,
    marginTop: spacing.md,
  },
  taskCard: {
    padding: spacing.lg,
  },
  taskHeader: {
    marginBottom: spacing.md,
  },
  taskTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  taskTitle: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginRight: spacing.sm,
  },
  statusBadgeSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusBadgeText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    textTransform: 'capitalize' as const,
  },
  taskDescription: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  taskSteps: {
    gap: spacing.sm,
  },
  taskStepsTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  wellnessCard: {
    padding: spacing.lg,
  },
  wellnessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  wellnessTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  wellnessValue: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  wellnessSubtext: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  alertCard: {
    padding: spacing.lg,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  alertTime: {
    fontSize: fontSizes.xs,
    color: colors.textLight,
  },
  alertMessage: {
    fontSize: fontSizes.sm,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  severityText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    textTransform: 'capitalize' as const,
  },
  infoCard: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  infoText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 20,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  messageButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.surface,
  },
  alertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  markAllButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  markAllText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
  emptySubtext: {
    fontSize: fontSizes.sm,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  alertIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  alertTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  taskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.primaryLight + '20',
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  taskBadgeText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.primary,
  },
  tabIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: fontWeights.bold,
    color: colors.surface,
  },
});
