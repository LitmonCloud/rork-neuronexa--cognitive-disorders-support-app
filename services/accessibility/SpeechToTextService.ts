import { Platform } from 'react-native';
import { Audio } from 'expo-audio';

export interface TranscriptionResult {
  text: string;
  language: string;
}

export interface RecordingState {
  isRecording: boolean;
  duration: number;
}

class SpeechToTextService {
  private recording: Audio.Recording | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        const result = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (result) {
          result.getTracks().forEach(track => track.stop());
          return true;
        }
        return false;
      } else {
        const { granted } = await Audio.requestPermissionsAsync();
        return granted;
      }
    } catch (error) {
      console.error('[SpeechToText] Permission error:', error);
      return false;
    }
  }

  async startRecording(): Promise<void> {
    try {
      console.log('[SpeechToText] Starting recording...');

      if (Platform.OS === 'web') {
        await this.startWebRecording();
      } else {
        await this.startMobileRecording();
      }

      console.log('[SpeechToText] Recording started successfully');
    } catch (error) {
      console.error('[SpeechToText] Failed to start recording:', error);
      throw error;
    }
  }

  private async startWebRecording(): Promise<void> {
    this.audioChunks = [];
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: 'audio/webm',
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  private async startMobileRecording(): Promise<void> {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    this.recording = new Audio.Recording();
    await this.recording.prepareToRecordAsync({
      android: {
        extension: '.m4a',
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
      },
      ios: {
        extension: '.m4a',
        audioQuality: 0x7F, // AVAudioQuality.high
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {},
    });

    await this.recording.startAsync();
  }

  async stopRecording(): Promise<string | null> {
    try {
      console.log('[SpeechToText] Stopping recording...');

      if (Platform.OS === 'web') {
        return await this.stopWebRecording();
      } else {
        return await this.stopMobileRecording();
      }
    } catch (error) {
      console.error('[SpeechToText] Failed to stop recording:', error);
      throw error;
    }
  }

  private async stopWebRecording(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          resolve(base64Audio);
        };
        
        reader.readAsDataURL(audioBlob);

        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
      };

      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    });
  }

  private async stopMobileRecording(): Promise<string | null> {
    if (!this.recording) {
      return null;
    }

    await this.recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = this.recording.getURI();
    this.recording = null;

    return uri;
  }

  async transcribe(audioUri: string, language?: string): Promise<TranscriptionResult> {
    try {
      console.log('[SpeechToText] Transcribing audio...');

      const formData = new FormData();

      if (Platform.OS === 'web') {
        const response = await fetch(audioUri);
        const blob = await response.blob();
        formData.append('audio', blob, 'recording.webm');
      } else {
        const uriParts = audioUri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        const audioFile = {
          uri: audioUri,
          name: `recording.${fileType}`,
          type: `audio/${fileType}`,
        } as any;

        formData.append('audio', audioFile);
      }

      if (language) {
        formData.append('language', language);
      }

      const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('[SpeechToText] Transcription successful:', result);

      return result as TranscriptionResult;
    } catch (error) {
      console.error('[SpeechToText] Transcription error:', error);
      throw error;
    }
  }

  async cancelRecording(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
        }
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
        this.mediaRecorder = null;
        this.audioChunks = [];
      } else {
        if (this.recording) {
          await this.recording.stopAndUnloadAsync();
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
          });
          this.recording = null;
        }
      }
    } catch (error) {
      console.error('[SpeechToText] Cancel recording error:', error);
    }
  }

  getRecordingStatus(): RecordingState | null {
    if (Platform.OS === 'web') {
      return this.mediaRecorder
        ? {
            isRecording: this.mediaRecorder.state === 'recording',
            duration: 0,
          }
        : null;
    } else {
      return this.recording
        ? {
            isRecording: true,
            duration: 0,
          }
        : null;
    }
  }
}

export default new SpeechToTextService();
