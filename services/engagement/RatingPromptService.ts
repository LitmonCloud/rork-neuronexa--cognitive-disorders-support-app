import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { Platform } from 'react-native';

interface RatingPromptState {
  lastPromptDate: string | null;
  promptCount: number;
  positiveActionsCount: number;
  appVersion: string;
  hasRated: boolean;
}

class RatingPromptService {
  private state: RatingPromptState = {
    lastPromptDate: null,
    promptCount: 0,
    positiveActionsCount: 0,
    appVersion: '1.0.0',
    hasRated: false,
  };

  private readonly MIN_POSITIVE_ACTIONS = 5;
  private readonly MIN_DAYS_BETWEEN_PROMPTS = 30;
  private readonly MAX_PROMPTS_PER_VERSION = 3;

  async initialize() {
    try {
      const stored = await AsyncStorage.getItem('rating_prompt_state');
      if (stored) {
        this.state = JSON.parse(stored);
      }
      console.log('[RatingPrompt] Initialized:', this.state);
    } catch (error) {
      console.error('[RatingPrompt] Initialization failed:', error);
    }
  }

  async shouldShowPrompt(): Promise<boolean> {
    if (this.state.hasRated) {
      return false;
    }

    if (this.state.promptCount >= this.MAX_PROMPTS_PER_VERSION) {
      return false;
    }

    if (this.state.positiveActionsCount < this.MIN_POSITIVE_ACTIONS) {
      return false;
    }

    if (this.state.lastPromptDate) {
      const daysSinceLastPrompt = this.getDaysSince(this.state.lastPromptDate);
      if (daysSinceLastPrompt < this.MIN_DAYS_BETWEEN_PROMPTS) {
        return false;
      }
    }

    const isAvailable = await StoreReview.hasAction();
    return isAvailable;
  }

  async requestReview(): Promise<void> {
    try {
      const shouldShow = await this.shouldShowPrompt();
      
      if (!shouldShow) {
        console.log('[RatingPrompt] Conditions not met for showing prompt');
        return;
      }

      if (Platform.OS === 'web') {
        console.log('[RatingPrompt] Rating prompt not available on web');
        return;
      }

      await StoreReview.requestReview();

      this.state.lastPromptDate = new Date().toISOString();
      this.state.promptCount += 1;
      await this.saveState();

      console.log('[RatingPrompt] Review requested');
    } catch (error) {
      console.error('[RatingPrompt] Request review failed:', error);
    }
  }

  trackPositiveAction(action: string): void {
    this.state.positiveActionsCount += 1;
    this.saveState();
    console.log('[RatingPrompt] Positive action tracked:', action, this.state.positiveActionsCount);
  }

  async markAsRated(): Promise<void> {
    this.state.hasRated = true;
    await this.saveState();
    console.log('[RatingPrompt] User marked as rated');
  }

  async reset(): Promise<void> {
    this.state = {
      lastPromptDate: null,
      promptCount: 0,
      positiveActionsCount: 0,
      appVersion: '1.0.0',
      hasRated: false,
    };
    await this.saveState();
    console.log('[RatingPrompt] State reset');
  }

  private getDaysSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  private async saveState(): Promise<void> {
    try {
      await AsyncStorage.setItem('rating_prompt_state', JSON.stringify(this.state));
    } catch (error) {
      console.error('[RatingPrompt] Failed to save state:', error);
    }
  }

  getState(): RatingPromptState {
    return { ...this.state };
  }
}

export const ratingPrompt = new RatingPromptService();
