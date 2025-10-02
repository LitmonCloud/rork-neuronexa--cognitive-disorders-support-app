import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Users, Plus, Phone, Mail, Trash2, Bell, BellOff, Star, LayoutDashboard, QrCode, UserPlus } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontSizes, fontWeights } from '@/theme/typography';
import { useCaregivers } from '@/contexts/CaregiverContext';
import Button from '@/components/Button';
import Card from '@/components/Card';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function CaregiverScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const { caregivers, addCaregiver, deleteCaregiver, setPrimaryCaregiver, sendTestAlert } = useCaregivers();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [sendingAlert, setSendingAlert] = useState<string | null>(null);

  const handleAddCaregiver = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Missing Information', 'Please enter at least a name and phone number.');
      return;
    }

    addCaregiver(name.trim(), phone.trim(), email.trim() || undefined, relationship.trim() || undefined);
    setName('');
    setPhone('');
    setEmail('');
    setRelationship('');
    setShowAddForm(false);
    Alert.alert('Success', 'Caregiver added successfully!');
  };

  const handleDelete = (id: string) => {
    deleteCaregiver(id);
    setDeleteConfirm(null);
  };

  const handleSendTestAlert = async (id: string) => {
    setSendingAlert(id);
    try {
      const success = await sendTestAlert(id);
      if (success) {
        Alert.alert(
          'Test Alert Sent',
          'In a production app, this would send an SMS or push notification to the caregiver.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send test alert');
    } finally {
      setSendingAlert(null);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.lg,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    headerTitle: {
      fontSize: fontSizes.xxl,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: spacing.xl,
    },
    description: {
      fontSize: fontSizes.md,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: spacing.xl,
    },
    addForm: {
      marginBottom: spacing.xl,
    },
    formTitle: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginBottom: spacing.lg,
    },
    input: {
      backgroundColor: colors.surfaceTint,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: fontSizes.md,
      color: colors.text,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    formActions: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.md,
    },
    formButton: {
      flex: 1,
    },
    emptyState: {
      alignItems: 'center',
      padding: spacing.xxxl,
    },
    emptyTitle: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    emptyText: {
      fontSize: fontSizes.md,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      lineHeight: 22,
    },
    caregiverList: {
      gap: spacing.lg,
      marginBottom: spacing.xl,
    },
    caregiverCard: {
      padding: spacing.lg,
    },
    caregiverHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    caregiverInfo: {
      flex: 1,
    },
    caregiverNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    caregiverName: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    primaryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.primaryLight + '30',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.sm,
    },
    primaryText: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.bold,
      color: colors.primary,
    },
    caregiverRelationship: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
    },
    deleteButton: {
      padding: spacing.sm,
    },
    caregiverDetails: {
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    detailText: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
    },
    caregiverActions: {
      flexDirection: 'row',
      gap: spacing.sm,
      flexWrap: 'wrap' as const,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.primaryLight + '20',
      borderRadius: borderRadius.sm,
    },
    testAlertButton: {
      backgroundColor: colors.primary + '15',
    },
    actionButtonText: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: colors.primary,
    },
    infoCard: {
      backgroundColor: colors.primaryLight + '15',
      borderColor: colors.primaryLight,
    },
    infoTitle: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    infoText: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    dashboardCard: {
      padding: spacing.lg,
      backgroundColor: colors.primaryLight + '15',
      borderColor: colors.primaryLight,
      marginBottom: spacing.lg,
    },
    dashboardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    dashboardTitle: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    dashboardText: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: spacing.md,
    },
    dashboardButton: {
      marginTop: spacing.sm,
    },
    inviteCard: {
      padding: spacing.lg,
      backgroundColor: colors.secondaryLight + '15',
      borderColor: colors.secondaryLight,
      marginBottom: spacing.lg,
    },
    inviteHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    inviteTitle: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    inviteText: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: spacing.md,
    },
    inviteButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    inviteButton: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.headerContent}>
          <Users size={28} color={colors.primary} />
          <Text style={styles.headerTitle}>Caregiver Support</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
          activeOpacity={0.7}
        >
          <Plus size={22} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.inviteCard}>
          <View style={styles.inviteHeader}>
            <UserPlus size={24} color={colors.secondary} />
            <Text style={styles.inviteTitle}>Invite Caregiver</Text>
          </View>
          <Text style={styles.inviteText}>
            Generate a secure code to invite a caregiver to access your dashboard.
          </Text>
          <View style={styles.inviteButtons}>
            <Button
              title="Generate Code"
              onPress={() => router.push('/invite-generate')}
              variant="primary"
              size="md"
              style={styles.inviteButton}
            />
            <Button
              title="Redeem Code"
              onPress={() => router.push('/invite-redeem')}
              variant="ghost"
              size="md"
              style={styles.inviteButton}
            />
          </View>
        </Card>

        <Card style={styles.dashboardCard}>
          <View style={styles.dashboardHeader}>
            <LayoutDashboard size={24} color={colors.primary} />
            <Text style={styles.dashboardTitle}>Caregiver Dashboard</Text>
          </View>
          <Text style={styles.dashboardText}>
            View patient progress, tasks, wellness data, and receive AI-powered insights.
          </Text>
          <Button
            title="Open Dashboard"
            onPress={() => router.push('/caregiver-dashboard')}
            variant="primary"
            size="md"
            style={styles.dashboardButton}
          />
        </Card>

        <Text style={styles.description}>
          Add trusted caregivers who can receive alerts and support you when needed.
          This feature is UI-only in this prototype.
        </Text>

        {showAddForm && (
          <Card style={styles.addForm}>
            <Text style={styles.formTitle}>Add New Caregiver</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Name *"
              placeholderTextColor={colors.textLight}
              value={name}
              onChangeText={setName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone Number *"
              placeholderTextColor={colors.textLight}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email (optional)"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Relationship (optional)"
              placeholderTextColor={colors.textLight}
              value={relationship}
              onChangeText={setRelationship}
            />

            <View style={styles.formActions}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowAddForm(false);
                  setName('');
                  setPhone('');
                  setEmail('');
                  setRelationship('');
                }}
                variant="ghost"
                size="md"
                style={styles.formButton}
              />
              <Button
                title="Add Caregiver"
                onPress={handleAddCaregiver}
                variant="primary"
                size="md"
                style={styles.formButton}
              />
            </View>
          </Card>
        )}

        {caregivers.length === 0 ? (
          <Card style={styles.emptyState}>
            <Users size={48} color={colors.textLight} />
            <Text style={styles.emptyTitle}>No Caregivers Yet</Text>
            <Text style={styles.emptyText}>
              Add a trusted caregiver to enable support features and emergency alerts.
            </Text>
          </Card>
        ) : (
          <View style={styles.caregiverList}>
            {caregivers.map((caregiver) => (
              <Card key={caregiver.id} style={styles.caregiverCard}>
                <View style={styles.caregiverHeader}>
                  <View style={styles.caregiverInfo}>
                    <View style={styles.caregiverNameRow}>
                      <Text style={styles.caregiverName}>{caregiver.name}</Text>
                      {caregiver.isPrimary && (
                        <View style={styles.primaryBadge}>
                          <Star size={12} color={colors.primary} fill={colors.primary} />
                          <Text style={styles.primaryText}>Primary</Text>
                        </View>
                      )}
                    </View>
                    {caregiver.relationship && (
                      <Text style={styles.caregiverRelationship}>{caregiver.relationship}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => setDeleteConfirm(caregiver.id)}
                    style={styles.deleteButton}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>

                <View style={styles.caregiverDetails}>
                  <View style={styles.detailRow}>
                    <Phone size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>{caregiver.phone}</Text>
                  </View>
                  {caregiver.email && (
                    <View style={styles.detailRow}>
                      <Mail size={16} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{caregiver.email}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.caregiverActions}>
                  {!caregiver.isPrimary && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setPrimaryCaregiver(caregiver.id)}
                      activeOpacity={0.7}
                    >
                      <Star size={16} color={colors.primary} />
                      <Text style={styles.actionButtonText}>Set as Primary</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionButton, styles.testAlertButton]}
                    onPress={() => handleSendTestAlert(caregiver.id)}
                    disabled={sendingAlert === caregiver.id}
                    activeOpacity={0.7}
                  >
                    {caregiver.notificationsEnabled ? (
                      <Bell size={16} color={colors.primary} />
                    ) : (
                      <BellOff size={16} color={colors.textLight} />
                    )}
                    <Text style={styles.actionButtonText}>
                      {sendingAlert === caregiver.id ? 'Sending...' : 'Send Test Alert'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        )}

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Caregiver Alerts</Text>
          <Text style={styles.infoText}>
            {`• Caregivers receive notifications when you need support
• Test alerts help ensure the system works
• Primary caregiver is contacted first
• All data is stored locally and securely
• Future: SMS, push notifications, and escalation`}
          </Text>
        </Card>
      </ScrollView>

      <ConfirmDialog
        visible={deleteConfirm !== null}
        title="Remove Caregiver?"
        message="Are you sure you want to remove this caregiver? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </View>
  );
}


