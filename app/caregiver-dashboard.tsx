import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Plus,
  Users,
  Edit2,
  Trash2,
  X,
  ChevronRight,
  Key,
  CheckCircle,
  XCircle,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontSizes, fontWeights } from '@/theme/typography';
import { usePatients } from '@/contexts/PatientContext';
import { useCaregivers } from '@/contexts/CaregiverContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import PremiumGate from '@/components/PremiumGate';
import {
  formatInviteCode,
  validateInviteCodeFormat,
} from '@/utils/inviteCodeGenerator';

export default function CaregiverDashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const { patients, addPatient, updatePatient, deletePatient, selectPatient } = usePatients();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastNameInitial, setLastNameInitial] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [addMethod, setAddMethod] = useState<'manual' | 'code'>('manual');
  const { redeemInvite } = useCaregivers();

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
      gap: spacing.xs,
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
    },
    addButtonText: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    modalContent: {
      width: '100%',
      maxWidth: 500,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      gap: spacing.lg,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputLabel: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: fontSizes.md,
      color: colors.text,
    },
    modalActions: {
      flexDirection: 'row',
      gap: spacing.md,
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
    codeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: colors.secondary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
    },
    codeButtonText: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      color: colors.surface,
    },
    methodSelector: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    methodButton: {
      flex: 1,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
    },
    methodButtonActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    methodButtonText: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    methodButtonTextActive: {
      color: colors.primary,
    },
    codeInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
    },
    codeInputWrapperError: {
      borderColor: colors.error,
    },
    codeInputWrapperValid: {
      borderColor: colors.success,
    },
    codeInput: {
      flex: 1,
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
      padding: spacing.md,
      letterSpacing: 2,
    },
    validationIcon: {
      paddingRight: spacing.md,
    },
    errorText: {
      fontSize: fontSizes.sm,
      color: colors.error,
      marginBottom: spacing.md,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      marginHorizontal: spacing.md,
    },
    helpText: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      marginBottom: spacing.md,
      lineHeight: 18,
    },
  });

  const handleAddPatient = async () => {
    if (!firstName.trim() || !lastNameInitial.trim()) {
      Alert.alert('Error', 'Please enter both first name and last name initial');
      return;
    }

    if (lastNameInitial.length > 1) {
      Alert.alert('Error', 'Last name initial should be a single letter');
      return;
    }

    await addPatient(firstName.trim(), lastNameInitial.trim().toUpperCase(), 'current-caregiver-id');
    setFirstName('');
    setLastNameInitial('');
    setShowAddModal(false);
  };

  const handleEditPatient = () => {
    if (!editingPatient || !firstName.trim() || !lastNameInitial.trim()) {
      Alert.alert('Error', 'Please enter both first name and last name initial');
      return;
    }

    if (lastNameInitial.length > 1) {
      Alert.alert('Error', 'Last name initial should be a single letter');
      return;
    }

    updatePatient(editingPatient, {
      firstName: firstName.trim(),
      lastNameInitial: lastNameInitial.trim().toUpperCase(),
    });
    setFirstName('');
    setLastNameInitial('');
    setEditingPatient(null);
    setShowEditModal(false);
  };

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

  const handleCodeChange = (text: string) => {
    const formatted = formatInviteCode(text);
    setInviteCode(formatted);
    setCodeError('');
  };

  const handleRedeemCode = async () => {
    Keyboard.dismiss();

    if (!validateInviteCodeFormat(inviteCode)) {
      setCodeError('Please enter a valid 8-character code');
      return;
    }

    setIsRedeeming(true);
    setCodeError('');
    console.log('[CaregiverDashboard] Attempting to redeem code:', inviteCode);

    try {
      const caregiverId = `caregiver-${Date.now()}`;
      const result = await redeemInvite(inviteCode, caregiverId);

      if (result.success) {
        console.log('[CaregiverDashboard] Code redeemed successfully');
        setInviteCode('');
        setShowAddModal(false);
        setShowCodeModal(false);
        Alert.alert(
          'Success!',
          'You are now connected to the patient. You can now manage their tasks.',
          [{ text: 'OK' }]
        );
      } else {
        console.error('[CaregiverDashboard] Failed to redeem:', result.error);
        
        let errorMessage = 'Failed to redeem invite code';
        if (result.error === 'Invalid invite code') {
          errorMessage = 'This code is not valid. Please check and try again.';
        } else if (result.error === 'This code has already been used') {
          errorMessage = 'This code has already been used. Please request a new one.';
        } else if (result.error === 'This code has expired') {
          errorMessage = 'This code has expired. Please request a new one from the patient.';
        }
        
        setCodeError(errorMessage);
      }
    } catch (err) {
      console.error('[CaregiverDashboard] Error redeeming invite:', err);
      setCodeError('An unexpected error occurred. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const openEditModal = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setEditingPatient(patientId);
      setFirstName(patient.firstName);
      setLastNameInitial(patient.lastNameInitial);
      setShowEditModal(true);
    }
  };

  return (
    <PremiumGate
      feature="Caregiver Dashboard"
      featureDescription="Manage multiple patients, create tasks, and monitor their progress in real-time."
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

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Card style={styles.infoCard}>
            <Text style={styles.infoText}>
              Manage your patients here. Select a patient to view and manage their tasks with a calendar view.
              All changes sync in real-time.
            </Text>
          </Card>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>My Patients</Text>
              <Text style={styles.sectionSubtitle}>
                {patients.length} {patients.length === 1 ? 'patient' : 'patients'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <TouchableOpacity
                style={styles.codeButton}
                onPress={() => setShowCodeModal(true)}
                activeOpacity={0.7}
              >
                <Key size={16} color={colors.surface} />
                <Text style={styles.codeButtonText}>Enter Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setAddMethod('manual');
                  setShowAddModal(true);
                }}
                activeOpacity={0.7}
              >
                <Plus size={16} color={colors.surface} />
                <Text style={styles.addButtonText}>Add Patient</Text>
              </TouchableOpacity>
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
                      onPress={() => openEditModal(patient.id)}
                      activeOpacity={0.7}
                    >
                      <Edit2 size={16} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleDeletePatient(patient.id, `${patient.firstName} ${patient.lastNameInitial}.`)}
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

        <Modal
          visible={showAddModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Patient</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowAddModal(false)}
                  activeOpacity={0.7}
                >
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.methodSelector}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    addMethod === 'code' && styles.methodButtonActive,
                  ]}
                  onPress={() => setAddMethod('code')}
                  activeOpacity={0.7}
                >
                  <Key size={24} color={addMethod === 'code' ? colors.primary : colors.textSecondary} />
                  <Text style={[
                    styles.methodButtonText,
                    addMethod === 'code' && styles.methodButtonTextActive,
                  ]}>Use Code</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    addMethod === 'manual' && styles.methodButtonActive,
                  ]}
                  onPress={() => setAddMethod('manual')}
                  activeOpacity={0.7}
                >
                  <Plus size={24} color={addMethod === 'manual' ? colors.primary : colors.textSecondary} />
                  <Text style={[
                    styles.methodButtonText,
                    addMethod === 'manual' && styles.methodButtonTextActive,
                  ]}>Manual Entry</Text>
                </TouchableOpacity>
              </View>

              {addMethod === 'code' ? (
                <>
                  <Text style={styles.helpText}>
                    Enter the 8-character code provided by the patient to connect as their caregiver.
                  </Text>
                  <View
                    style={[
                      styles.codeInputWrapper,
                      codeError && styles.codeInputWrapperError,
                      validateInviteCodeFormat(inviteCode) && styles.codeInputWrapperValid,
                    ]}
                  >
                    <TextInput
                      style={styles.codeInput}
                      value={inviteCode}
                      onChangeText={handleCodeChange}
                      placeholder="XXXX-XXXX"
                      placeholderTextColor={colors.textLight}
                      autoCapitalize="characters"
                      autoCorrect={false}
                      maxLength={9}
                      editable={!isRedeeming}
                    />
                    {inviteCode.length > 0 && (
                      <View style={styles.validationIcon}>
                        {validateInviteCodeFormat(inviteCode) ? (
                          <CheckCircle size={20} color={colors.success} />
                        ) : (
                          <XCircle size={20} color={colors.error} />
                        )}
                      </View>
                    )}
                  </View>
                  {codeError ? (
                    <Text style={styles.errorText}>{codeError}</Text>
                  ) : null}
                  <View style={styles.modalActions}>
                    <Button
                      title="Cancel"
                      onPress={() => {
                        setShowAddModal(false);
                        setInviteCode('');
                        setCodeError('');
                      }}
                      variant="secondary"
                      style={{ flex: 1 }}
                    />
                    <Button
                      title={isRedeeming ? 'Connecting...' : 'Connect'}
                      onPress={handleRedeemCode}
                      disabled={!validateInviteCodeFormat(inviteCode) || isRedeeming}
                      style={{ flex: 1 }}
                    />
                  </View>
                </>
              ) : (
                <>
                  <View>
                    <Text style={styles.inputLabel}>First Name *</Text>
                    <TextInput
                      style={styles.input}
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="e.g., John"
                      placeholderTextColor={colors.textLight}
                      autoCapitalize="words"
                    />
                  </View>

                  <View>
                    <Text style={styles.inputLabel}>Last Name Initial *</Text>
                    <TextInput
                      style={styles.input}
                      value={lastNameInitial}
                      onChangeText={(text) => setLastNameInitial(text.slice(0, 1))}
                      placeholder="e.g., D"
                      placeholderTextColor={colors.textLight}
                      maxLength={1}
                      autoCapitalize="characters"
                    />
                  </View>

                  <View style={styles.modalActions}>
                    <Button
                      title="Cancel"
                      onPress={() => setShowAddModal(false)}
                      variant="secondary"
                      style={{ flex: 1 }}
                    />
                    <Button
                      title="Add Patient"
                      onPress={handleAddPatient}
                      style={{ flex: 1 }}
                    />
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

        <Modal
          visible={showCodeModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCodeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Enter Patient Code</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setShowCodeModal(false);
                    setInviteCode('');
                    setCodeError('');
                  }}
                  activeOpacity={0.7}
                >
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <Text style={styles.helpText}>
                Enter the 8-character code provided by the patient to connect as their caregiver.
              </Text>

              <View
                style={[
                  styles.codeInputWrapper,
                  codeError && styles.codeInputWrapperError,
                  validateInviteCodeFormat(inviteCode) && styles.codeInputWrapperValid,
                ]}
              >
                <TextInput
                  style={styles.codeInput}
                  value={inviteCode}
                  onChangeText={handleCodeChange}
                  placeholder="XXXX-XXXX"
                  placeholderTextColor={colors.textLight}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={9}
                  editable={!isRedeeming}
                  autoFocus
                />
                {inviteCode.length > 0 && (
                  <View style={styles.validationIcon}>
                    {validateInviteCodeFormat(inviteCode) ? (
                      <CheckCircle size={20} color={colors.success} />
                    ) : (
                      <XCircle size={20} color={colors.error} />
                    )}
                  </View>
                )}
              </View>
              {codeError ? (
                <Text style={styles.errorText}>{codeError}</Text>
              ) : null}

              <Card style={styles.infoCard}>
                <Text style={styles.infoText}>
                  • Codes expire after 15 minutes{"\n"}
                  • Each code can only be used once{"\n"}
                  • Make sure you enter the code exactly as shown
                </Text>
              </Card>

              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setShowCodeModal(false);
                    setInviteCode('');
                    setCodeError('');
                  }}
                  variant="secondary"
                  style={{ flex: 1 }}
                />
                <Button
                  title={isRedeeming ? 'Connecting...' : 'Connect'}
                  onPress={handleRedeemCode}
                  disabled={!validateInviteCodeFormat(inviteCode) || isRedeeming}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showEditModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Patient</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowEditModal(false)}
                  activeOpacity={0.7}
                >
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View>
                <Text style={styles.inputLabel}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="e.g., John"
                  placeholderTextColor={colors.textLight}
                  autoCapitalize="words"
                />
              </View>

              <View>
                <Text style={styles.inputLabel}>Last Name Initial *</Text>
                <TextInput
                  style={styles.input}
                  value={lastNameInitial}
                  onChangeText={(text) => setLastNameInitial(text.slice(0, 1))}
                  placeholder="e.g., D"
                  placeholderTextColor={colors.textLight}
                  maxLength={1}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  onPress={() => setShowEditModal(false)}
                  variant="secondary"
                  style={{ flex: 1 }}
                />
                <Button
                  title="Save Changes"
                  onPress={handleEditPatient}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </PremiumGate>
  );
}
