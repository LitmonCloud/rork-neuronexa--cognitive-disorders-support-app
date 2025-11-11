import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export interface SpeechOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
  onDone?: () => void;
  onError?: (error: Error) => void;
}

class TextToSpeechService {
  private isSpeaking: boolean = false;
  private currentUtterance: string | null = null;

  async speak(text: string, options?: SpeechOptions): Promise<void> {
    try {
      console.log('[TTS] Speaking:', text.substring(0, 50));

      if (this.isSpeaking) {
        await this.stop();
      }

      this.isSpeaking = true;
      this.currentUtterance = text;

      const speechOptions: Speech.SpeechOptions = {
        language: options?.language || 'en-US',
        pitch: options?.pitch || 1.0,
        rate: options?.rate || 0.9,
        volume: options?.volume !== undefined ? options.volume : 1.0,
        onDone: () => {
          console.log('[TTS] Speech completed');
          this.isSpeaking = false;
          this.currentUtterance = null;
          options?.onDone?.();
        },
        onStopped: () => {
          console.log('[TTS] Speech stopped');
          this.isSpeaking = false;
          this.currentUtterance = null;
        },
        onError: (error) => {
          console.error('[TTS] Speech error:', error);
          this.isSpeaking = false;
          this.currentUtterance = null;
          options?.onError?.(new Error(error));
        },
      };

      await Speech.speak(text, speechOptions);
    } catch (error) {
      console.error('[TTS] Failed to speak:', error);
      this.isSpeaking = false;
      this.currentUtterance = null;
      options?.onError?.(error as Error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      if (this.isSpeaking) {
        await Speech.stop();
        this.isSpeaking = false;
        this.currentUtterance = null;
      }
    } catch (error) {
      console.error('[TTS] Failed to stop:', error);
    }
  }

  async pause(): Promise<void> {
    try {
      if (this.isSpeaking && Platform.OS === 'ios') {
        await Speech.pause();
      }
    } catch (error) {
      console.error('[TTS] Failed to pause:', error);
    }
  }

  async resume(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await Speech.resume();
      }
    } catch (error) {
      console.error('[TTS] Failed to resume:', error);
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  getCurrentUtterance(): string | null {
    return this.currentUtterance;
  }

  async getAvailableVoices(): Promise<Speech.Voice[]> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices;
    } catch (error) {
      console.error('[TTS] Failed to get voices:', error);
      return [];
    }
  }

  async speakWithPriority(
    text: string,
    priority: 'low' | 'normal' | 'high',
    options?: SpeechOptions
  ): Promise<void> {
    if (priority === 'high') {
      await this.stop();
      await this.speak(text, options);
    } else if (priority === 'normal') {
      if (!this.isSpeaking) {
        await this.speak(text, options);
      }
    } else {
      if (!this.isSpeaking) {
        await this.speak(text, options);
      }
    }
  }

  async announceForAccessibility(text: string): Promise<void> {
    await this.speakWithPriority(text, 'high', {
      rate: 0.9,
      pitch: 1.0,
    });
  }
}

export default new TextToSpeechService();
