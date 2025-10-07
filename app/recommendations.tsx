import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useRecommendations } from '@/contexts/RecommendationContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import RecommendationCard from '@/components/RecommendationCard';
import { Sparkles, RefreshCw, ChevronLeft, Lightbulb } from 'lucide-react-native';

export default function RecommendationsScreen() {
  const { colors } = useTheme();
  const { recommendations, refreshRecommendations } = useRecommendations();
  const { settings } = useAccessibility();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshRecommendations();
    setRefreshing(false);
  };

  const textSize = settings.largeText ? 1.2 : 1;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    refreshButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryLight + '20',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primaryLight + '30',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      flex: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
    },
    badge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: colors.surface,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 60,
      paddingHorizontal: 20,
    },
    emptyIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primaryLight + '30',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 10,
      textAlign: 'center' as const,
    },
    emptyText: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      lineHeight: 22,
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    emptyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 24,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    emptyButtonText: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: colors.surface,
    },
    infoCard: {
      backgroundColor: colors.primaryLight + '15',
      borderRadius: 16,
      padding: 16,
      marginTop: 20,
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colors.primary,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            activeOpacity={0.7}
            disabled={refreshing}
          >
            <RefreshCw size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Sparkles size={24} color={colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { fontSize: 28 * textSize }]}>
              For You
            </Text>
            <Text style={[styles.subtitle, { fontSize: 15 * textSize }]}>
              Personalized recommendations
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {recommendations.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontSize: 18 * textSize }]}>
                Recommended for You
              </Text>
              <View style={styles.badge}>
                <Text style={[styles.badgeText, { fontSize: 12 * textSize }]}>
                  {recommendations.length}
                </Text>
              </View>
            </View>

            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}

            <View style={styles.infoCard}>
              <Text style={[styles.infoTitle, { fontSize: 16 * textSize }]}>
                💡 How Recommendations Work
              </Text>
              <Text style={[styles.infoText, { fontSize: 14 * textSize }]}>
                Nexa learns from your habits, preferences, and patterns to provide personalized suggestions. 
                The more you use the app, the better the recommendations become!
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Lightbulb size={40} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { fontSize: 22 * textSize }]}>
              Building Your Profile
            </Text>
            <Text style={[styles.emptyText, { fontSize: 15 * textSize }]}>
              As you use Nexa, we&apos;ll learn your preferences and habits to provide personalized recommendations. 
              Start by creating some tasks or exploring the app!
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={handleRefresh}
              activeOpacity={0.7}
            >
              <RefreshCw size={18} color={colors.surface} />
              <Text style={[styles.emptyButtonText, { fontSize: 15 * textSize }]}>
                Check for Recommendations
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
