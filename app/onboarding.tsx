import { StyleSheet, Text, View, TouchableOpacity, Animated, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useDementia } from '@/contexts/DementiaContext';
import { useFunnel } from '@/contexts/FunnelContext';
import { useTheme, lightColors } from '@/contexts/ThemeContext';
import { Brain, Users, ChevronRight, Check, User, Trash2 } from 'lucide-react-native';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome!',
    description: "Let's get to know you better",
  },
  {
    id: 2,
    title: 'Your Role',
    description: 'How will you be using Nexa?',
  },
  {
    id: 3,
    title: 'Emergency Contacts',
    description: 'Add people who can help in case of emergency',
  },
  {
    id: 4,
    title: 'All Set!',
    description: "You're ready to start your journey",
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { updateProfile } = useUserProfile();
  const { addEmergencyContact } = useDementia();
  const { trackStep } = useFunnel();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState('');
  const [role, setRole] = useState<'patient' | 'caregiver' | null>(null);
  const [contacts, setContacts] = useState<{ name: string; phone: string; relationship: string }[]>([]);
  const [currentContact, setCurrentContact] = useState({ name: '', phone: '', relationship: '' });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 10,
      alignItems: 'flex-end',
    },
    skipButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    skipText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '600' as const,
    },
    content: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 40,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
      alignSelf: 'center',
    },
    textContainer: {
      marginBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: '800' as const,
      color: colors.text,
      marginBottom: 12,
      letterSpacing: -0.5,
    },
    description: {
      fontSize: 17,
      color: colors.textSecondary,
      lineHeight: 26,
    },
    inputContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    roleContainer: {
      gap: 16,
    },
    roleButton: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      borderWidth: 2,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    roleButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    roleIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    roleTextContainer: {
      flex: 1,
    },
    roleTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 4,
    },
    roleDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    contactsList: {
      gap: 12,
      marginBottom: 24,
    },
    contactCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    contactInfo: {
      flex: 1,
    },
    contactName: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 2,
    },
    contactDetails: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    deleteButton: {
      padding: 8,
    },
    addContactButton: {
      backgroundColor: colors.primary + '15',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primary + '30',
      borderStyle: 'dashed',
    },
    addContactText: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: colors.primary,
    },
    pagination: {
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
      marginBottom: 24,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
    },
    paginationDotActive: {
      width: 32,
      backgroundColor: colors.primary,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    nextButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 18,
      borderRadius: 16,
      backgroundColor: colors.primary,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    nextButtonDisabled: {
      backgroundColor: colors.border,
    },
    nextButtonText: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.surface,
    },
    completionContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    completionIcon: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: lightColors.decorative.mint + '30',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    completionTitle: {
      fontSize: 28,
      fontWeight: '800' as const,
      color: colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    completionDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  useEffect(() => {
    trackStep('onboarding_start');
  }, [trackStep]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [currentIndex, slideAnim]);

  const canProceed = () => {
    if (currentIndex === 0) return name.trim().length > 0;
    if (currentIndex === 1) return role !== null;
    if (currentIndex === 2) return true;
    return true;
  };

  const shouldShowEmergencyContacts = () => {
    return role === 'patient';
  };

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      if (!canProceed()) return;

      if (currentIndex === 0) {
        updateProfile({ name });
        trackStep('onboarding_profile');
      }
      if (currentIndex === 1) {
        updateProfile({ role: role! });
        trackStep('onboarding_goals');
        
        if (role === 'caregiver') {
          trackStep('onboarding_complete');
          updateProfile({ onboardingCompleted: true });
          router.replace('/paywall');
          return;
        }
      }
      if (currentIndex === 2) {
        contacts.forEach(contact => {
          addEmergencyContact({
            name: contact.name,
            relationship: contact.relationship,
            phoneNumber: contact.phone,
            isPrimary: contacts.indexOf(contact) === 0,
            order: contacts.indexOf(contact),
          });
        });
        trackStep('onboarding_preferences');
      }

      setCurrentIndex(currentIndex + 1);
      slideAnim.setValue(0);
    } else {
      trackStep('onboarding_complete');
      updateProfile({ onboardingCompleted: true });
      if (role === 'caregiver') {
        router.replace('/paywall');
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  const handleSkip = () => {
    if (currentIndex === 2) {
      updateProfile({ onboardingCompleted: true });
      router.replace('/(tabs)');
    }
  };

  const addContact = () => {
    if (currentContact.name.trim() && currentContact.phone.trim()) {
      setContacts([...contacts, currentContact]);
      setCurrentContact({ name: '', phone: '', relationship: '' });
    }
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const slideTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const slideOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const renderStepContent = () => {
    switch (currentIndex) {
      case 0:
        return (
          <Animated.View
            style={{
              transform: [{ translateY: slideTranslateY }],
              opacity: slideOpacity,
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: lightColors.decorative.lavender + '30' }]}>
              <User size={40} color={lightColors.decorative.lavender} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{steps[0].title}</Text>
              <Text style={styles.description}>{steps[0].description}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>What&apos;s your name?</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={colors.textLight}
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>
          </Animated.View>
        );

      case 1:
        return (
          <Animated.View
            style={{
              transform: [{ translateY: slideTranslateY }],
              opacity: slideOpacity,
            }}
          >
            <View style={styles.textContainer}>
              <Text style={styles.title}>{steps[1].title}</Text>
              <Text style={styles.description}>{steps[1].description}</Text>
            </View>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'patient' && styles.roleButtonSelected]}
                onPress={() => setRole('patient')}
                activeOpacity={0.7}
              >
                <View style={[styles.roleIconContainer, { backgroundColor: lightColors.decorative.mint + '30' }]}>
                  <Brain size={28} color={lightColors.decorative.mint} />
                </View>
                <View style={styles.roleTextContainer}>
                  <Text style={styles.roleTitle}>I&apos;m a Patient/User</Text>
                  <Text style={styles.roleDescription}>I need help managing my tasks and daily activities</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleButton, role === 'caregiver' && styles.roleButtonSelected]}
                onPress={() => setRole('caregiver')}
                activeOpacity={0.7}
              >
                <View style={[styles.roleIconContainer, { backgroundColor: lightColors.decorative.peach + '30' }]}>
                  <Users size={28} color={lightColors.decorative.peach} />
                </View>
                <View style={styles.roleTextContainer}>
                  <Text style={styles.roleTitle}>I&apos;m a Caregiver</Text>
                  <Text style={styles.roleDescription}>I help someone manage their tasks and provide support</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );

      case 2:
        if (!shouldShowEmergencyContacts()) {
          return null;
        }
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Animated.View
                style={{
                  transform: [{ translateY: slideTranslateY }],
                  opacity: slideOpacity,
                }}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{steps[2].title}</Text>
                  <Text style={styles.description}>Add people who can help you in case of emergency</Text>
                </View>

                {contacts.length > 0 && (
                  <View style={styles.contactsList}>
                    {contacts.map((contact, index) => (
                      <View key={index} style={styles.contactCard}>
                        <View style={styles.contactInfo}>
                          <Text style={styles.contactName}>{contact.name}</Text>
                          <Text style={styles.contactDetails}>
                            {contact.phone} • {contact.relationship || 'Contact'}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => removeContact(index)}
                        >
                          <Trash2 size={20} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Contact Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., John Smith"
                    placeholderTextColor={colors.textLight}
                    value={currentContact.name}
                    onChangeText={(text) => setCurrentContact({ ...currentContact, name: text })}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., (555) 123-4567"
                    placeholderTextColor={colors.textLight}
                    value={currentContact.phone}
                    onChangeText={(text) => setCurrentContact({ ...currentContact, phone: text })}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Relationship (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Family, Friend, Therapist"
                    placeholderTextColor={colors.textLight}
                    value={currentContact.relationship}
                    onChangeText={(text) => setCurrentContact({ ...currentContact, relationship: text })}
                  />
                </View>

                <TouchableOpacity
                  style={styles.addContactButton}
                  onPress={addContact}
                  disabled={!currentContact.name.trim() || !currentContact.phone.trim()}
                >
                  <Text style={styles.addContactText}>+ Add Contact</Text>
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        );

      case 3:
        return (
          <Animated.View
            style={{
              transform: [{ translateY: slideTranslateY }],
              opacity: slideOpacity,
            }}
          >
            <View style={styles.completionContainer}>
              <View style={styles.completionIcon}>
                <Check size={50} color={lightColors.decorative.mint} />
              </View>
              <Text style={styles.completionTitle}>You&apos;re All Set, {name}!</Text>
              <Text style={styles.completionDescription}>
                {role === 'caregiver'
                  ? "You can now manage tasks and provide support to your patients."
                  : "Let&apos;s start breaking down tasks and achieving your goals together."}
              </Text>
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        {currentIndex === 2 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {renderStepContent()}
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          activeOpacity={0.8}
          disabled={!canProceed()}
        >
          {currentIndex === steps.length - 1 ? (
            <>
              <Check size={24} color={colors.surface} />
              <Text style={styles.nextButtonText}>Get Started</Text>
            </>
          ) : (
            <>
              <Text style={styles.nextButtonText}>Continue</Text>
              <ChevronRight size={24} color={colors.surface} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
