import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { Eye, Type, Zap, Volume2, Brain, Heart, Phone, MessageCircle, Info, Users, BookOpen, Shield, Video, ChevronRight, Sparkles, Languages, Image as ImageIcon, Bell, Moon, Sun, Monitor, FileText, HelpCircle, Mail, Database } from 'lucide-react-native';
import { mentalHealthResources } from '@/constants/mentalHealthResources';
import { MentalHealthResource } from '@/types/mentalHealth';

export default function SettingsScreen() {
  const { settings, toggleSetting } = useAccessibility();
  const { colors, themeMode, setThemeMode } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
      marginBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.textSecondary,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
      marginBottom: 12,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 1,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    settingText: {
      flex: 1,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 12,
    },
    infoText: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    resourcesSection: {
      marginBottom: 24,
    },
    resourcesSectionTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 6,
    },
    resourcesSectionDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    resourceCard: {
      flexDirection: 'row',
      alignItems: 'center',
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
    resourceIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    resourceContent: {
      flex: 1,
    },
    resourceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    resourceTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      flex: 1,
    },
    badge: {
      backgroundColor: colors.success,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '700' as const,
      color: colors.surface,
    },
    resourceDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
      lineHeight: 20,
    },
    resourceContact: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.primary,
    },
    crisisFooter: {
      backgroundColor: colors.primaryLight,
      borderRadius: 12,
      padding: 16,
      marginTop: 8,
    },
    crisisFooterText: {
      fontSize: 13,
      color: colors.primary,
      textAlign: 'center' as const,
      lineHeight: 20,
      fontWeight: '600' as const,
    },
  });

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <Sun size={20} color={colors.accent} />;
      case 'dark':
        return <Moon size={20} color={colors.accent} />;
      case 'system':
        return <Monitor size={20} color={colors.accent} />;
    }
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
    }
  };

  const cycleTheme = () => {
    const modes: ThemeMode[] = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const getIconComponent = (iconName: string, size: number, color: string) => {
    switch (iconName) {
      case 'phone':
        return <Phone size={size} color={color} />;
      case 'message-circle':
        return <MessageCircle size={size} color={color} />;
      case 'heart':
        return <Heart size={size} color={color} />;
      case 'info':
        return <Info size={size} color={color} />;
      case 'users':
        return <Users size={size} color={color} />;
      case 'book-open':
        return <BookOpen size={size} color={color} />;
      case 'shield':
        return <Shield size={size} color={color} />;
      case 'video':
        return <Video size={size} color={color} />;
      default:
        return <Heart size={size} color={color} />;
    }
  };

  const handleResourcePress = async (resource: MentalHealthResource) => {
    if (resource.phone) {
      const phoneUrl = `tel:${resource.phone}`;
      const canOpen = await Linking.canOpenURL(phoneUrl);
      if (canOpen) {
        await Linking.openURL(phoneUrl);
      }
    } else if (resource.url) {
      const canOpen = await Linking.canOpenURL(resource.url);
      if (canOpen) {
        await Linking.openURL(resource.url);
      }
    }
  };

  const renderResourceCard = (resource: MentalHealthResource) => (
    <TouchableOpacity
      key={resource.id}
      style={styles.resourceCard}
      onPress={() => handleResourcePress(resource)}
      activeOpacity={0.7}
    >
      <View style={styles.resourceIconContainer}>
        {getIconComponent(resource.icon, 24, colors.primary)}
      </View>
      <View style={styles.resourceContent}>
        <View style={styles.resourceHeader}>
          <Text style={styles.resourceTitle}>{resource.title}</Text>
          {resource.available24x7 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>24/7</Text>
            </View>
          )}
        </View>
        <Text style={styles.resourceDescription}>{resource.description}</Text>
        {resource.phone && (
          <Text style={styles.resourceContact}>{resource.phone}</Text>
        )}
      </View>
      <ChevronRight size={20} color={colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Accessibility</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={cycleTheme}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
                {getThemeIcon()}
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Theme</Text>
                <Text style={styles.settingDescription}>Currently: {getThemeLabel()}</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => router.push('/notification-settings')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Bell size={20} color={colors.primary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDescription}>Manage notification preferences</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visual Settings</Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => toggleSetting('highContrast')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Eye size={20} color={colors.primary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>High Contrast</Text>
                <Text style={styles.settingDescription}>Increase text visibility</Text>
              </View>
            </View>
            <Switch
              value={settings.highContrast}
              onValueChange={() => toggleSetting('highContrast')}
              trackColor={{ false: colors.borderLight, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => toggleSetting('largeText')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
                <Type size={20} color={colors.secondary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Large Text</Text>
                <Text style={styles.settingDescription}>Easier to read</Text>
              </View>
            </View>
            <Switch
              value={settings.largeText}
              onValueChange={() => toggleSetting('largeText')}
              trackColor={{ false: colors.borderLight, true: colors.secondary }}
              thumbColor={colors.surface}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Motion & Interaction</Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => toggleSetting('reducedMotion')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
                <Zap size={20} color={colors.accent} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Reduced Motion</Text>
                <Text style={styles.settingDescription}>Minimize animations</Text>
              </View>
            </View>
            <Switch
              value={settings.reducedMotion}
              onValueChange={() => toggleSetting('reducedMotion')}
              trackColor={{ false: colors.borderLight, true: colors.accent }}
              thumbColor={colors.surface}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio Assistance</Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => toggleSetting('voiceGuidance')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primaryDark + '20' }]}>
                <Volume2 size={20} color={colors.primaryDark} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Voice Guidance</Text>
                <Text style={styles.settingDescription}>Audio task instructions</Text>
              </View>
            </View>
            <Switch
              value={settings.voiceGuidance}
              onValueChange={() => toggleSetting('voiceGuidance')}
              trackColor={{ false: colors.borderLight, true: colors.primaryDark }}
              thumbColor={colors.surface}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cognitive Support</Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => toggleSetting('cognitiveMode')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
                <Brain size={20} color={colors.secondary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Cognitive Support Mode</Text>
                <Text style={styles.settingDescription}>Simplified UI with extra guidance</Text>
              </View>
            </View>
            <Switch
              value={settings.cognitiveMode}
              onValueChange={() => toggleSetting('cognitiveMode')}
              trackColor={{ false: colors.borderLight, true: colors.secondary }}
              thumbColor={colors.surface}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => toggleSetting('stepByStepMode')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Sparkles size={20} color={colors.primary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>AI Step-by-Step Coach</Text>
                <Text style={styles.settingDescription}>One step at a time with encouragement</Text>
              </View>
            </View>
            <Switch
              value={settings.stepByStepMode}
              onValueChange={() => toggleSetting('stepByStepMode')}
              trackColor={{ false: colors.borderLight, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => toggleSetting('autoReadSteps')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
                <Volume2 size={20} color={colors.accent} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Auto-Read Steps</Text>
                <Text style={styles.settingDescription}>Automatically read each step aloud</Text>
              </View>
            </View>
            <Switch
              value={settings.autoReadSteps}
              onValueChange={() => toggleSetting('autoReadSteps')}
              trackColor={{ false: colors.borderLight, true: colors.accent }}
              thumbColor={colors.surface}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => toggleSetting('visualCuesEnabled')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
                <ImageIcon size={20} color={colors.warning} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Visual Cues</Text>
                <Text style={styles.settingDescription}>Show icons and images for guidance</Text>
              </View>
            </View>
            <Switch
              value={settings.visualCuesEnabled}
              onValueChange={() => toggleSetting('visualCuesEnabled')}
              trackColor={{ false: colors.borderLight, true: colors.warning }}
              thumbColor={colors.surface}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => toggleSetting('simplifiedLanguage')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
                <Languages size={20} color={colors.success} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Simplified Language</Text>
                <Text style={styles.settingDescription}>Use easier words and shorter sentences</Text>
              </View>
            </View>
            <Switch
              value={settings.simplifiedLanguage}
              onValueChange={() => toggleSetting('simplifiedLanguage')}
              trackColor={{ false: colors.borderLight, true: colors.success }}
              thumbColor={colors.surface}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mental Health Resources</Text>
          
          <View style={styles.resourcesSection}>
            <Text style={styles.resourcesSectionTitle}>Crisis Support</Text>
            <Text style={styles.resourcesSectionDescription}>
              Immediate help available 24/7
            </Text>
            {mentalHealthResources
              .filter((r) => r.category === 'crisis')
              .map(renderResourceCard)}
          </View>

          <View style={styles.resourcesSection}>
            <Text style={styles.resourcesSectionTitle}>Support & Community</Text>
            {mentalHealthResources
              .filter((r) => r.category === 'support')
              .map(renderResourceCard)}
          </View>

          <View style={styles.resourcesSection}>
            <Text style={styles.resourcesSectionTitle}>Education & Resources</Text>
            {mentalHealthResources
              .filter((r) => r.category === 'education')
              .map(renderResourceCard)}
          </View>

          <View style={styles.resourcesSection}>
            <Text style={styles.resourcesSectionTitle}>Therapy Services</Text>
            {mentalHealthResources
              .filter((r) => r.category === 'therapy')
              .map(renderResourceCard)}
          </View>

          <View style={styles.crisisFooter}>
            <Text style={styles.crisisFooterText}>
              If you&apos;re in crisis, please call 988 or go to your nearest emergency room.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal & Support</Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => Linking.openURL(process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL || 'https://neuronexa.app/legal/privacy')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Shield size={20} color={colors.primary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Privacy Policy</Text>
                <Text style={styles.settingDescription}>How we protect your data</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => Linking.openURL(process.env.EXPO_PUBLIC_TERMS_URL || 'https://neuronexa.app/legal/terms')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
                <FileText size={20} color={colors.secondary} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Terms of Service</Text>
                <Text style={styles.settingDescription}>Usage terms and conditions</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => Linking.openURL(process.env.EXPO_PUBLIC_ACCESSIBILITY_URL || 'https://neuronexa.app/legal/accessibility')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
                <HelpCircle size={20} color={colors.accent} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Accessibility Statement</Text>
                <Text style={styles.settingDescription}>Our commitment to accessibility</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => Linking.openURL(process.env.EXPO_PUBLIC_DATA_RETENTION_URL || 'https://neuronexa.app/legal/data-retention')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
                <Database size={20} color={colors.warning} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Data Retention Policy</Text>
                <Text style={styles.settingDescription}>How long we keep your data</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => Linking.openURL(process.env.EXPO_PUBLIC_SUPPORT_URL || 'https://neuronexa.app/support')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
                <Mail size={20} color={colors.success} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Support</Text>
                <Text style={styles.settingDescription}>Get help and contact us</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About NeuroNexa</Text>
          <Text style={styles.infoText}>
            Designed with neurodiversity in mind. We support individuals with ADHD, Autism, 
            Anxiety, and cognitive challenges through compassionate, AI-powered task guidance.
          </Text>
          <Text style={[styles.infoText, { marginTop: 12, fontSize: 13, fontStyle: 'italic' as const }]}>
            Version {process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0'}
          </Text>
          <Text style={[styles.infoText, { marginTop: 8, fontSize: 12, color: colors.textLight }]}>
            © 2025 NeuroNexa. All rights reserved.
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.warning + '15', borderColor: colors.warning, marginTop: 16 }]}>
          <Text style={[styles.infoTitle, { color: colors.warning }]}>Medical Disclaimer</Text>
          <Text style={[styles.infoText, { color: colors.text }]}>
            NeuroNexa is not a medical device and does not provide medical advice, diagnosis, or treatment. 
            Always consult with a qualified healthcare professional for medical concerns.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
