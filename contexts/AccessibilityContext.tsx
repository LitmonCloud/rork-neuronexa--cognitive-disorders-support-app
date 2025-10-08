import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { AccessibilitySettings } from '@/types/task';

const SETTINGS_STORAGE_KEY = '@nexa_accessibility';

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  voiceGuidance: false,
  cognitiveMode: false,
  stepByStepMode: false,
  autoReadSteps: false,
  visualCuesEnabled: true,
  simplifiedLanguage: false,
  screenReaderOptimized: false,
  hapticFeedback: true,
  colorBlindMode: 'none',
  focusIndicators: true,
};

export const [AccessibilityProvider, useAccessibility] = createContextHook(() => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = useCallback(async (updates: Partial<AccessibilitySettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
    }
  }, [settings]);

  const toggleSetting = useCallback((key: keyof AccessibilitySettings) => {
    updateSettings({ [key]: !settings[key] });
  }, [settings, updateSettings]);

  return useMemo(() => ({
    settings,
    isLoading,
    updateSettings,
    toggleSetting,
  }), [settings, isLoading, updateSettings, toggleSetting]);
});
