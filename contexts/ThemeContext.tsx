import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export const lightColors = {
  primary: '#6B7FD7',
  primaryLight: '#A8B4F5',
  primaryDark: '#4A5BA7',
  
  secondary: '#7DD3C0',
  secondaryLight: '#B5EDE3',
  secondaryDark: '#5AA89A',
  
  accent: '#FFB4A2',
  accentLight: '#FFD4C8',
  accentDark: '#E89580',
  
  tertiary: '#F4C2C2',
  tertiaryLight: '#FFE0E0',
  tertiaryDark: '#D89999',
  
  background: '#F8F7FF',
  surface: '#FFFFFF',
  surfaceSecondary: '#FAFAFF',
  surfaceTint: '#F0EFFF',
  
  text: '#2D3142',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  
  success: '#7DD3C0',
  warning: '#FFB4A2',
  error: '#F4A5A5',
  
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  shadow: 'rgba(107, 127, 215, 0.1)',
  overlay: 'rgba(45, 49, 66, 0.4)',
  
  decorative: {
    pink: '#FFB4D5',
    lavender: '#D4C5F9',
    mint: '#B4F8C8',
    peach: '#FFD4A3',
    sky: '#A8D8EA',
  },
};

export const darkColors = {
  primary: '#8B9FE8',
  primaryLight: '#A8B4F5',
  primaryDark: '#6B7FD7',
  
  secondary: '#5FC4AF',
  secondaryLight: '#7DD3C0',
  secondaryDark: '#4A9B8A',
  
  accent: '#FF9B87',
  accentLight: '#FFB4A2',
  accentDark: '#E87A66',
  
  tertiary: '#E8A8A8',
  tertiaryLight: '#F4C2C2',
  tertiaryDark: '#D88888',
  
  background: '#1A1B23',
  surface: '#25262F',
  surfaceSecondary: '#2D2E38',
  surfaceTint: '#32333E',
  
  text: '#E8E9F3',
  textSecondary: '#A8AEBF',
  textLight: '#6B7280',
  
  success: '#5FC4AF',
  warning: '#FF9B87',
  error: '#E88888',
  
  border: '#3A3B45',
  borderLight: '#32333E',
  
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.6)',
  
  decorative: {
    pink: '#E89BC5',
    lavender: '#B4A5D9',
    mint: '#94D8A8',
    peach: '#E8B483',
    sky: '#88B8CA',
  },
};

const THEME_STORAGE_KEY = '@neuronexa_theme_mode';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
        setThemeModeState(stored as ThemeMode);
      }
    } catch (error) {
      console.error('Failed to load theme mode:', error);
    }
  };

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  }, []);

  return useMemo(() => ({
    themeMode,
    setThemeMode,
    isDark,
    colors,
  }), [themeMode, setThemeMode, isDark, colors]);
});
