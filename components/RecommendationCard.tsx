import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Recommendation } from '@/types/recommendation';
import { useTheme } from '@/contexts/ThemeContext';
import { useRecommendations } from '@/contexts/RecommendationContext';
import { 
  Sparkles, 
  Heart, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Target,
  X,
  ChevronRight,
  AlertCircle,
  Info
} from 'lucide-react-native';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onDismiss?: () => void;
}

export default function RecommendationCard({ recommendation, onDismiss }: RecommendationCardProps) {
  const { colors } = useTheme();
  const { dismissRecommendation, completeRecommendation } = useRecommendations();

  const getIcon = () => {
    switch (recommendation.type) {
      case 'task':
        return <Target size={20} color={colors.primary} />;
      case 'breathing':
      case 'wellness':
        return <Heart size={20} color={colors.accent} />;
      case 'resource':
        return <BookOpen size={20} color={colors.secondary} />;
      case 'feature':
        return <Sparkles size={20} color={colors.primary} />;
      case 'timing':
        return <Clock size={20} color={colors.warning} />;
      case 'habit':
        return <TrendingUp size={20} color={colors.success} />;
      default:
        return <Info size={20} color={colors.textSecondary} />;
    }
  };

  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'urgent':
        return colors.error;
      case 'high':
        return colors.warning;
      case 'medium':
        return colors.primary;
      case 'low':
        return colors.success;
    }
  };

  const getPriorityIcon = () => {
    switch (recommendation.priority) {
      case 'urgent':
        return <AlertCircle size={14} color={colors.error} />;
      case 'high':
        return <AlertCircle size={14} color={colors.warning} />;
      default:
        return null;
    }
  };

  const handleAction = () => {
    if (recommendation.actionCallback) {
      recommendation.actionCallback();
    } else if (recommendation.actionRoute) {
      router.push(recommendation.actionRoute as any);
    }
    completeRecommendation(recommendation.id);
  };

  const handleDismiss = () => {
    dismissRecommendation(recommendation.id);
    onDismiss?.();
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
      gap: 10,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primaryLight + '20',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerContent: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colors.text,
      flex: 1,
    },
    priorityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    priorityText: {
      fontSize: 10,
      fontWeight: '700' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 4,
    },
    reason: {
      fontSize: 12,
      color: colors.textLight,
      fontStyle: 'italic' as const,
    },
    dismissButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surfaceTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    relevanceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    relevanceBar: {
      width: 60,
      height: 4,
      backgroundColor: colors.surfaceTint,
      borderRadius: 2,
      overflow: 'hidden' as const,
    },
    relevanceFill: {
      height: '100%',
      borderRadius: 2,
    },
    relevanceText: {
      fontSize: 11,
      color: colors.textLight,
      fontWeight: '600' as const,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 12,
    },
    actionButtonText: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: colors.surface,
    },
  });

  const priorityColor = getPriorityColor();
  const relevancePercentage = Math.round(recommendation.relevanceScore * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            {getIcon()}
          </View>
          <View style={styles.headerContent}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={2}>
                {recommendation.title}
              </Text>
              {(recommendation.priority === 'urgent' || recommendation.priority === 'high') && (
                <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
                  {getPriorityIcon()}
                  <Text style={[styles.priorityText, { color: priorityColor }]}>
                    {recommendation.priority}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.description}>{recommendation.description}</Text>
            <Text style={styles.reason}>💡 {recommendation.reason}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={handleDismiss}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <View style={styles.relevanceContainer}>
          <View style={styles.relevanceBar}>
            <View 
              style={[
                styles.relevanceFill, 
                { 
                  width: `${relevancePercentage}%`,
                  backgroundColor: colors.primary,
                }
              ]} 
            />
          </View>
          <Text style={styles.relevanceText}>{relevancePercentage}% match</Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleAction}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>{recommendation.actionLabel}</Text>
          <ChevronRight size={14} color={colors.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
