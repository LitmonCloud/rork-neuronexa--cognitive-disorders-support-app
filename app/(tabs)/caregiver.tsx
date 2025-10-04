import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Plus,
  Users,
  Trash2,
  ChevronRight,
  Phone,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontSizes, fontWeights } from '@/theme/typography';
import { usePatients } from '@/contexts/PatientContext';
import Card from '@/components/Card';
import PremiumGate from '@/components/PremiumGate';
import EnterCodeBar from '@/components/EnterCodeBar';
import AddPatientModal from '@/components/AddPatientModal';

export default function CaregiverScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const { patients, deletePatient, selectPatient } = usePatients();

  const [showAddModal, setShowAddModal] = useState(false);



  const handleDeletePatient = (patientId: string, patientName: string) => {
    Alert.alert(
      'Delete Patient',
      `Are you sure you want to remove ${patientName}? This will also delete all their tasks.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePatient(patientId),
        },
      ]
    );
  };

  const handleSelectPatient = (patientId: string) => {
    selectPatient(patientId);
    router.push('/caregiver-patient-tasks');
  };



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: fontSizes.xxl,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: spacing.lg,
      gap: spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    sectionSubtitle: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    addButtonText: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      color: colors.surface,
    },
    patientCard: {
      padding: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    patientAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    patientInitials: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.surface,
    },
    patientInfo: {
      flex: 1,
    },
    patientName: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    patientMeta: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
    },
    patientActions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    iconButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.sm,
      backgroundColor: colors.border,
    },
    emptyState: {
      alignItems: 'center',
      padding: spacing.xxxl,
    },
    emptyText: {
      fontSize: fontSizes.md,
      color: colors.textLight,
      marginTop: spacing.md,
      textAlign: 'center' as const,
    },

    infoCard: {
      padding: spacing.lg,
      backgroundColor: colors.primaryLight + '15',
      borderColor: colors.primaryLight,
    },
    infoText: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.headerTitle}>Caregiver Dashboard</Text>
      </View>

      <EnterCodeBar />

      <PremiumGate
        feature="Caregiver Dashboard"
        featureDescription="Manage multiple patients, create tasks, and monitor their progress in real-time."
      >
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Card style={styles.infoCard}>
            <Text style={styles.infoText}>
              Manage your patients here. Select a patient to view and manage their tasks with a calendar view.
              All changes sync in real-time.
            </Text>
          </Card>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.7}
          >
            <Plus size={20} color={colors.surface} />
            <Text style={styles.addButtonText}>Add Patient</Text>
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>My Patients</Text>
              <Text style={styles.sectionSubtitle}>
                {patients.length} {patients.length === 1 ? 'patient' : 'patients'}
              </Text>
            </View>
          </View>

          {patients.length === 0 ? (
            <Card style={styles.emptyState}>
              <Users size={48} color={colors.textLight} />
              <Text style={styles.emptyText}>
                No patients yet. Add your first patient to get started.
              </Text>
            </Card>
          ) : (
            patients.map((patient) => (
              <TouchableOpacity
                key={patient.id}
                onPress={() => handleSelectPatient(patient.id)}
                activeOpacity={0.7}
              >
                <Card style={styles.patientCard}>
                  <View style={[styles.patientAvatar, { backgroundColor: patient.profileColor || colors.primary }]}>
                    <Text style={styles.patientInitials}>
                      {patient.firstName.charAt(0).toUpperCase()}{patient.lastNameInitial.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>
                      {patient.firstName} {patient.lastNameInitial}.
                    </Text>
                    <Text style={styles.patientMeta}>
                      Added {new Date(patient.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.patientActions}>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        selectPatient(patient.id);
                        router.push('/emergency-contacts');
                      }}
                      activeOpacity={0.7}
                    >
                      <Phone size={16} color={colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeletePatient(patient.id, `${patient.firstName} ${patient.lastNameInitial}.`);
                      }}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={16} color={colors.error} />
                    </TouchableOpacity>
                    <View style={styles.iconButton}>
                      <ChevronRight size={16} color={colors.textSecondary} />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </PremiumGate>

      <AddPatientModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        defaultMethod="manual"
      />
    </View>
  );
}


