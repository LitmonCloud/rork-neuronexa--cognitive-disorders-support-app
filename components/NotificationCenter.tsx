import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Bell, CheckCircle, Trash2, Filter, X } from 'lucide-react-native';
import { useNotifications } from '@/contexts/NotificationContext';
import { AppNotification } from '@/types/notification';
import { useRouter } from 'expo-router';

interface NotificationItemProps {
  notification: AppNotification;
  onPress: () => void;
  onDismiss: () => void;
}

function NotificationItem({ notification, onPress, onDismiss }: NotificationItemProps) {
  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'urgent': return '#FF3B30';
      case 'high': return '#FF9500';
      case 'medium': return '#007AFF';
      case 'low': return '#34C759';
      default: return '#007AFF';
    }
  };

  const getTimeAgo = () => {
    const now = new Date();
    const notifTime = new Date(notification.timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifTime.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !notification.read && styles.unreadItem,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor() }]} />
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.notificationTime}>{getTimeAgo()}</Text>
        </View>
        
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {notification.message}
        </Text>

        {notification.metadata && (
          <View style={styles.metadata}>
            {notification.metadata.completedSteps !== undefined && (
              <Text style={styles.metadataText}>
                {notification.metadata.completedSteps}/{notification.metadata.totalSteps} steps
              </Text>
            )}
            {notification.metadata.priority && (
              <Text style={[styles.metadataText, styles.priorityBadge]}>
                {notification.metadata.priority}
              </Text>
            )}
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={onDismiss}
        style={styles.dismissButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X size={18} color="#8E8E93" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export function NotificationCenter() {
  const router = useRouter();
  const { 
    notifications, 
    stats, 
    markAsRead, 
    markAllAsRead, 
    dismissNotification,
    clearRead,
  } = useNotifications();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const displayedNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleNotificationPress = (notification: AppNotification) => {
    markAsRead(notification.id);
    
    if (notification.taskId) {
      router.push(`/task/${notification.taskId}`);
    } else if (notification.actions && notification.actions.length > 0) {
      const primaryAction = notification.actions[0];
      if (primaryAction.action === 'navigate' && primaryAction.route) {
        router.push(primaryAction.route as any);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Bell size={24} color="#000000" />
          <Text style={styles.headerTitle}>Notifications</Text>
          {stats.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{stats.unread}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            style={styles.headerButton}
          >
            <Filter size={20} color="#007AFF" />
          </TouchableOpacity>
          
          {stats.unread > 0 && (
            <TouchableOpacity
              onPress={markAllAsRead}
              style={styles.headerButton}
            >
              <CheckCircle size={20} color="#007AFF" />
            </TouchableOpacity>
          )}
          
          {notifications.filter(n => n.read).length > 0 && (
            <TouchableOpacity
              onPress={clearRead}
              style={styles.headerButton}
            >
              <Trash2 size={20} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.activeFilterTabText]}>
            All ({stats.total})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filter === 'unread' && styles.activeFilterTab]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterTabText, filter === 'unread' && styles.activeFilterTabText]}>
            Unread ({stats.unread})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {displayedNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={64} color="#C7C7CC" />
            <Text style={styles.emptyStateTitle}>
              {filter === 'unread' ? 'All caught up!' : 'No notifications'}
            </Text>
            <Text style={styles.emptyStateMessage}>
              {filter === 'unread' 
                ? 'You have no unread notifications'
                : 'Notifications will appear here'}
            </Text>
          </View>
        ) : (
          displayedNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onPress={() => handleNotificationPress(notification)}
              onDismiss={() => dismissNotification(notification.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#000000',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center' as const,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  headerActions: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  filterTabs: {
    flexDirection: 'row' as const,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  activeFilterTab: {
    backgroundColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#8E8E93',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row' as const,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadItem: {
    backgroundColor: '#F0F8FF',
  },
  priorityIndicator: {
    width: 4,
  },
  notificationContent: {
    flex: 1,
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#000000',
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row' as const,
    gap: 8,
    flexWrap: 'wrap' as const,
  },
  metadataText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  priorityBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  dismissButton: {
    padding: 16,
    justifyContent: 'center' as const,
  },
  emptyState: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center' as const,
  },
});
