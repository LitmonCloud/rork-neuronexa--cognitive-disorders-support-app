import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useDementia } from '@/contexts/DementiaContext';
import { usePatients } from '@/contexts/PatientContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { ArrowLeft, User, Plus, Trash2, Edit2, Star } from 'lucide-react-native';
import { useState } from 'react';
import { EmergencyContact } from '@/types/dementia';

export default function EmergencyContactsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useUserProfile();
  const { selectedPatientId, patients } = usePatients();
  const { emergencyContacts, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact } = useDementia();
  
  const isCaregiver = profile?.role === 'caregiver';
  const selectedPatient = selectedPatientId ? patients.find(p => p.id === selectedPatientId) : null;
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phoneNumber: '',
  });

  const handleSave = () => {
    if (isCaregiver) {
      Alert.alert('View Only', 'Caregivers can view but not edit patient emergency contacts.');
      return;
    }

    if (!formData.name || !formData.phoneNumber) {
      Alert.alert('Missing Information', 'Please enter name and phone number');
      return;
    }

    if (editingId) {
      updateEmergencyContact(editingId, formData);
      setEditingId(null);
    } else {
      addEmergencyContact({
        ...formData,
        isPrimary: emergencyContacts.length === 0,
        order: emergencyContacts.length,
      });
      setIsAdding(false);
    }
    
    setFormData({ name: '', relationship: '', phoneNumber: '' });
  };

  const handleEdit = (contact: EmergencyContact) => {
    if (isCaregiver) {
      Alert.alert('View Only', 'Caregivers can view but not edit patient emergency contacts.');
      return;
    }
    setEditingId(contact.id);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phoneNumber: contact.phoneNumber,
    });
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (isCaregiver) {
      Alert.alert('View Only', 'Caregivers can view but not edit patient emergency contacts.');
      return;
    }
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteEmergencyContact(id)
        }
      ]
    );
  };

  const handleSetPrimary = (id: string) => {
    if (isCaregiver) {
      Alert.alert('View Only', 'Caregivers can view but not edit patient emergency contacts.');
      return;
    }
    emergencyContacts.forEach(contact => {
      updateEmergencyContact(contact.id, { isPrimary: contact.id === id });
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: insets.top + 16,
      paddingBottom: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: colors.primaryLight,
    },
    backButtonText: {
      fontSize: 18,
      color: '#000000',
      fontWeight: '700' as const,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: colors.text,
      flex: 1,
      textAlign: 'center' as const,
      marginRight: 80,
    },
    content: {
      flex: 1,
    },
    section: {
      padding: 20,
    },
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 24,
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colors.surface,
    },
    contactCard: {
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
    contactCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
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
    primaryBadge: {
      backgroundColor: colors.warning,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    primaryBadgeText: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: colors.surface,
    },
    contactActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
    },
    formCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 16,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    formActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    cancelButton: {
      flex: 1,
      padding: 14,
      borderRadius: 12,
      alignItems: 'center',
      backgroundColor: colors.borderLight,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
    },
    saveButton: {
      flex: 1,
      padding: 14,
      borderRadius: 12,
      alignItems: 'center',
      backgroundColor: colors.primary,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colors.surface,
    },
    emptyState: {
      alignItems: 'center',
      padding: 48,
    },
    emptyStateText: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      marginTop: 12,
      lineHeight: 22,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#000000" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isCaregiver && selectedPatient
            ? `${selectedPatient.firstName}'s Contacts`
            : 'Emergency Contacts'}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {isCaregiver && (
            <View style={[styles.contactCard, { backgroundColor: colors.primaryLight + '20', borderColor: colors.primary }]}>
              <Text style={{ color: colors.text, fontSize: 14, lineHeight: 20 }}>
                You are viewing {selectedPatient?.firstName || 'patient'}&apos;s emergency contacts. Only the patient can edit these contacts.
              </Text>
            </View>
          )}
          {!isAdding && !isCaregiver && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAdding(true)}
              activeOpacity={0.7}
            >
              <Plus size={20} color={colors.surface} />
              <Text style={styles.addButtonText}>Add Emergency Contact</Text>
            </TouchableOpacity>
          )}

          {isAdding && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                {editingId ? 'Edit Contact' : 'New Contact'}
              </Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Enter name"
                  placeholderTextColor={colors.textLight}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Relationship</Text>
                <TextInput
                  style={styles.input}
                  value={formData.relationship}
                  onChangeText={(text) => setFormData({ ...formData, relationship: text })}
                  placeholder="e.g., Spouse, Daughter, Friend"
                  placeholderTextColor={colors.textLight}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phoneNumber}
                  onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                  placeholder="Enter phone number"
                  placeholderTextColor={colors.textLight}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setFormData({ name: '', relationship: '', phoneNumber: '' });
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  activeOpacity={0.7}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {emergencyContacts.length === 0 && !isAdding ? (
            <View style={styles.emptyState}>
              <User size={64} color={colors.textLight} />
              <Text style={styles.emptyStateText}>
                No emergency contacts added yet.{'\n'}
                Add contacts to quickly reach loved ones in case of emergency.
              </Text>
            </View>
          ) : (
            emergencyContacts.map(contact => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.contactCardContent}>
                  <View style={styles.contactPhoto}>
                    {contact.photoUri ? (
                      <Image source={{ uri: contact.photoUri }} style={{ width: 60, height: 60, borderRadius: 30 }} />
                    ) : (
                      <User size={30} color={colors.primary} />
                    )}
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    {contact.relationship && (
                      <Text style={styles.contactRelationship}>{contact.relationship}</Text>
                    )}
                    <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
                  </View>
                  {contact.isPrimary && (
                    <View style={styles.primaryBadge}>
                      <Star size={12} color={colors.surface} fill={colors.surface} />
                      <Text style={styles.primaryBadgeText}>Primary</Text>
                    </View>
                  )}
                </View>

                <View style={styles.contactActions}>
                  {!contact.isPrimary && (
                    <TouchableOpacity
                      style={[styles.actionButton, { borderColor: colors.warning, backgroundColor: colors.warning + '10' }]}
                      onPress={() => handleSetPrimary(contact.id)}
                      activeOpacity={0.7}
                    >
                      <Star size={16} color={colors.warning} />
                      <Text style={{ fontSize: 14, fontWeight: '600' as const, color: colors.warning }}>
                        Set Primary
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionButton, { borderColor: colors.primary, backgroundColor: colors.primaryLight }]}
                    onPress={() => handleEdit(contact)}
                    activeOpacity={0.7}
                  >
                    <Edit2 size={16} color={colors.primary} />
                    <Text style={{ fontSize: 14, fontWeight: '600' as const, color: colors.primary }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { borderColor: colors.error, backgroundColor: colors.error + '10' }]}
                    onPress={() => handleDelete(contact.id)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
