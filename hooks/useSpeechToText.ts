import { useState, useCallback, useRef, useEffect } from 'react';
import SpeechToTextService, { TranscriptionResult } from '@/services/accessibility/SpeechToTextService';

export interface UseSpeechToTextResult {
  isRecording: boolean;
  isTranscribing: boolean;
  transcription: string;
  error: Error | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  cancelRecording: () => Promise<void>;
  clearTranscription: () => void;
  hasPermission: boolean;
  requestPermission: () => Promise<void>;
}

export function useSpeechToText(options?: {
  language?: string;
  onTranscriptionComplete?: (result: TranscriptionResult) => void;
  onError?: (error: Error) => void;
}): UseSpeechToTextResult {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const audioUriRef = useRef<string | null>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const granted = await SpeechToTextService.requestPermissions();
      setHasPermission(granted);
    } catch (err) {
      console.error('[useSpeechToText] Permission check error:', err);
      setHasPermission(false);
    }
  };

  const requestPermission = useCallback(async () => {
    try {
      const granted = await SpeechToTextService.requestPermissions();
      setHasPermission(granted);
      if (!granted) {
        setError(new Error('Microphone permission denied'));
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Permission request failed');
      setError(errorObj);
      options?.onError?.(errorObj);
    }
  }, [options]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      if (!hasPermission) {
        await requestPermission();
        return;
      }

      await SpeechToTextService.startRecording();
      setIsRecording(true);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to start recording');
      setError(errorObj);
      setIsRecording(false);
      options?.onError?.(errorObj);
    }
  }, [hasPermission, requestPermission, options]);

  const stopRecording = useCallback(async () => {
    try {
      setIsRecording(false);
      setIsTranscribing(true);
      
      const uri = await SpeechToTextService.stopRecording();
      
      if (!uri) {
        throw new Error('No audio recorded');
      }

      audioUriRef.current = uri;

      const result = await SpeechToTextService.transcribe(uri, options?.language);
      
      setTranscription(result.text);
      setIsTranscribing(false);
      options?.onTranscriptionComplete?.(result);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to transcribe audio');
      setError(errorObj);
      setIsTranscribing(false);
      options?.onError?.(errorObj);
    }
  }, [options]);

  const cancelRecording = useCallback(async () => {
    try {
      await SpeechToTextService.cancelRecording();
      setIsRecording(false);
      setError(null);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to cancel recording');
      setError(errorObj);
      options?.onError?.(errorObj);
    }
  }, [options]);

  const clearTranscription = useCallback(() => {
    setTranscription('');
    setError(null);
    audioUriRef.current = null;
  }, []);

  return {
    isRecording,
    isTranscribing,
    transcription,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    clearTranscription,
    hasPermission,
    requestPermission,
  };
}
