import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useDementia } from '@/contexts/DementiaContext';
import { 
  Calendar, 
  Clock, 
  Phone, 
  Pill, 
  BookOpen, 
  User,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';

export default function DementiaSupportScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { 
    settings, 
    emergencyContacts, 
    memoryJournal,
    getOrientationInfo,
    getUpcomingMedications,
    getTodayRoutineAnchors,
  } = useDementia();

  const [orientationInfo, setOrientationInfo] = useState(getOrientationInfo());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setOrientationInfo(getOrientationInfo());
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, [getOrientationInfo]);

  const upcomingMeds = getUpcomingMedications();
  const todayRoutine = getTodayRoutineAnchors();
  const primaryContact = emergencyContacts.find(c => c.isPrimary) || emergencyContacts[0];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleEmergencyCall = async () => {
    if (primaryContact?.phoneNumber) {
      const phoneUrl = `tel:${primaryContact.phoneNumber}`;
      const canOpen = await Linking.canOpenURL(phoneUrl);
      if (canOpen) {
        await Linking.openURL(phoneUrl);
      }
    }
  };

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
      marginBottom: 24,
    },
    greeting: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 8,
    },
    orientationCard: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    orientationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    orientationIcon: {
      marginRight: 12,
    },
    orientationText: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: colors.surface,
    },
    orientationLabel: {
      fontSize: 14,
      color: colors.surface,
      opacity: 0.8,
      marginBottom: 4,
    },
    emergencyButton: {
      backgroundColor: colors.error,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: colors.error,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    emergencyButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    emergencyButtonText: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.surface,
      marginLeft: 12,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
    },
    seeAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    seeAllText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.primary,
      marginRight: 4,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      flex: 1,
    },
    cardTime: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.primary,
    },
    cardDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    contactCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    contactPhoto: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    contactPhotoImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    contactInfo: {
      flex: 1,
    },
    contactName: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 2,
    },
    contactRelationship: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    contactPhone: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.primary,
    },
    journalCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    journalImage: {
      width: '100%',
      height: 150,
      borderRadius: 12,
      marginBottom: 12,
      backgroundColor: colors.borderLight,
    },
    journalTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 4,
    },
    journalDate: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    emptyState: {
      alignItems: 'center',
      padding: 32,
    },
    emptyStateText: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      marginTop: 12,
    },
    setupCard: {
      backgroundColor: colors.primaryLight,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    setupTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.primary,
      marginBottom: 8,
    },
    setupDescription: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
      marginBottom: 16,
    },
    setupButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 14,
      alignItems: 'center',
    },
    setupButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.surface,
    },
  });

  if (!settings?.enabled) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Memory Support</Text>
          </View>

          <View style={styles.setupCard}>
            <Shield size={32} color={colors.primary} style={{ marginBottom: 12 }} />
            <Text style={styles.setupTitle}>Enable Memory Support Features</Text>
            <Text style={styles.setupDescription}>
              Specialized features designed to help with daily orientation, medication reminders, 
              emergency contacts, and memory aids. These tools can provide extra support for 
              individuals experiencing memory challenges.
            </Text>
            <TouchableOpacity 
              style={styles.setupButton}
              onPress={() => router.push('/settings')}
              activeOpacity={0.7}
            >
              <Text style={styles.setupButtonText}>Set Up Memory Support</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: colors.primaryLight }]}>
                <HelpCircle size={20} color={colors.primary} />
              </View>
              <Text style={styles.cardTitle}>What&apos;s Included?</Text>
            </View>
            <Text style={styles.cardDescription}>
              • Daily orientation reminders (date, time, location){'\n'}
              • Photo-based emergency contacts{'\n'}
              • Medication reminders with visual aids{'\n'}
              • Memory journal with photos{'\n'}
              • Daily routine anchors{'\n'}
              • Repetitive question support{'\n'}
              • Location safety features
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
        </View>

        <View style={styles.orientationCard}>
          <View style={styles.orientationRow}>
            <Calendar size={24} color={colors.surface} style={styles.orientationIcon} />
            <View>
              <Text style={styles.orientationLabel}>Today is</Text>
              <Text style={styles.orientationText}>{orientationInfo.dayOfWeek}</Text>
              <Text style={styles.orientationText}>{orientationInfo.date}</Text>
            </View>
          </View>
          <View style={styles.orientationRow}>
            <Clock size={24} color={colors.surface} style={styles.orientationIcon} />
            <View>
              <Text style={styles.orientationLabel}>Current time</Text>
              <Text style={styles.orientationText}>{orientationInfo.time}</Text>
            </View>
          </View>
        </View>

        {primaryContact && (
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={handleEmergencyCall}
            activeOpacity={0.8}
          >
            <View style={styles.emergencyButtonContent}>
              <Phone size={24} color={colors.surface} />
              <Text style={styles.emergencyButtonText}>
                Call {primaryContact.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {upcomingMeds.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Medications</Text>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => {}}
              >
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            {upcomingMeds.slice(0, 2).map(med => (
              <View key={med.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIcon, { backgroundColor: colors.warning + '20' }]}>
                    <Pill size={20} color={colors.warning} />
                  </View>
                  <Text style={styles.cardTitle}>{med.medicationName}</Text>
                  <Text style={styles.cardTime}>{med.times[0]}</Text>
                </View>
                <Text style={styles.cardDescription}>{med.dosage}</Text>
              </View>
            ))}
          </View>
        )}

        {todayRoutine.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today&apos;s Routine</Text>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => {}}
              >
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            {todayRoutine.slice(0, 3).map(anchor => (
              <View key={anchor.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIcon, { backgroundColor: colors.primaryLight }]}>
                    <Clock size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.cardTitle}>{anchor.title}</Text>
                  <Text style={styles.cardTime}>{anchor.time}</Text>
                </View>
                <Text style={styles.cardDescription}>{anchor.description}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push('/emergency-contacts')}
            >
              <Text style={styles.seeAllText}>Manage</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {emergencyContacts.length === 0 ? (
            <View style={styles.emptyState}>
              <User size={48} color={colors.textLight} />
              <Text style={styles.emptyStateText}>
                No emergency contacts added yet.{'\n'}
                Add contacts to quickly reach loved ones.
              </Text>
            </View>
          ) : (
            emergencyContacts.slice(0, 3).map(contact => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactCard}
                onPress={async () => {
                  const phoneUrl = `tel:${contact.phoneNumber}`;
                  const canOpen = await Linking.canOpenURL(phoneUrl);
                  if (canOpen) {
                    await Linking.openURL(phoneUrl);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.contactPhoto}>
                  {contact.photoUri && contact.photoUri.trim() !== '' ? (
                    <Image source={{ uri: contact.photoUri }} style={styles.contactPhotoImage} />
                  ) : (
                    <User size={30} color={colors.primary} />
                  )}
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRelationship}>{contact.relationship}</Text>
                  <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
                </View>
                <Phone size={24} color={colors.primary} />
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Memory Journal</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push('/memory-journal')}
            >
              <Text style={styles.seeAllText}>View All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {memoryJournal.length === 0 ? (
            <View style={styles.emptyState}>
              <BookOpen size={48} color={colors.textLight} />
              <Text style={styles.emptyStateText}>
                No journal entries yet.{'\n'}
                Capture memories with photos and notes.
              </Text>
            </View>
          ) : (
            memoryJournal.slice(0, 2).map(entry => (
              <TouchableOpacity
                key={entry.id}
                style={styles.journalCard}
                onPress={() => router.push('/memory-journal')}
                activeOpacity={0.7}
              >
                {entry.photoUris.length > 0 && entry.photoUris[0] && entry.photoUris[0].trim() !== '' && (
                  <Image source={{ uri: entry.photoUris[0] }} style={styles.journalImage} />
                )}
                <Text style={styles.journalTitle}>{entry.title}</Text>
                <Text style={styles.journalDate}>
                  {new Date(entry.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
