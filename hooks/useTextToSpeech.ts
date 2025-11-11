import { useState, useCallback, useEffect } from 'react';
import TextToSpeechService, { SpeechOptions } from '@/services/accessibility/TextToSpeechService';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export interface UseTextToSpeechResult {
  speak: (text: string, options?: SpeechOptions) => Promise<void>;
  stop: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  isSpeaking: boolean;
  currentUtterance: string | null;
  announceForAccessibility: (text: string) => Promise<void>;
}

export function useTextToSpeech(): UseTextToSpeechResult {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<string | null>(null);
  const { settings } = useAccessibility();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(TextToSpeechService.getIsSpeaking());
      setCurrentUtterance(TextToSpeechService.getCurrentUtterance());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const speak = useCallback(async (text: string, options?: SpeechOptions) => {
    if (!settings.voiceGuidance && !settings.autoReadSteps && !settings.screenReaderOptimized) {
      return;
    }

    await TextToSpeechService.speak(text, options);
  }, [settings.voiceGuidance, settings.autoReadSteps, settings.screenReaderOptimized]);

  const stop = useCallback(async () => {
    await TextToSpeechService.stop();
  }, []);

  const pause = useCallback(async () => {
    await TextToSpeechService.pause();
  }, []);

  const resume = useCallback(async () => {
    await TextToSpeechService.resume();
  }, []);

  const announceForAccessibility = useCallback(async (text: string) => {
    if (settings.voiceGuidance || settings.screenReaderOptimized) {
      await TextToSpeechService.announceForAccessibility(text);
    }
  }, [settings.voiceGuidance, settings.screenReaderOptimized]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    currentUtterance,
    announceForAccessibility,
  };
}
