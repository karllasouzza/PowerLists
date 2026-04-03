import { useCallback, useEffect, useRef, useState } from 'react';
import { useSpeechRecognitionEvent } from 'expo-speech-recognition';

import { showToast } from '@/services';

import {
  getErrorMessageFromEvent,
  getTranscriptFromResultEvent,
  requestSpeechPermission,
  startSpeechRecognition,
  stopSpeechRecognition,
} from '../services/speech-recognition-service';
import { parseTranscript } from '../utils/parse-transcript';
import type { ChatMessage, SpeechErrorEvent, SpeechResultEvent } from '../types';
import useAssistantAudios from './use-assistant-audios';
import { useListItemCreationFlow } from './use-list-item-creation-flow';

export const useVoiceAssistantLogics = (listId: string) => {
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [directMode, setDirectMode] = useState<'manual' | 'auto'>('manual');
  const directModeRef = useRef<'manual' | 'auto'>(directMode);
  const startAttemptRef = useRef(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const { addingListItemPlayer, successPlayer, errorPlayer, errorNotificationPlayer } =
    useAssistantAudios();

  const { executeCreationFlow } = useListItemCreationFlow(setChatMessages, {
    addingListItemPlayer,
    successPlayer,
    errorPlayer,
    errorNotificationPlayer,
  });

  useEffect(() => {
    directModeRef.current = directMode;
  }, [directMode]);

  useSpeechRecognitionEvent('start', () => {
    setRecognizing(true);
    setErrorMessage(null);
  });

  useSpeechRecognitionEvent('end', () => {
    setRecognizing(false);
  });

  useSpeechRecognitionEvent('result', (event: SpeechResultEvent) => {
    const nextTranscript = getTranscriptFromResultEvent(event);
    if (!nextTranscript) {
      return;
    }

    const { title, amount } = parseTranscript(nextTranscript);

    if (!title) {
      return;
    }

    // Step 1: append user transcript bubble
    setChatMessages((prev) => [...prev, { type: 'user', text: nextTranscript }]);

    // Steps 2-6: acknowledgment card + create item + audio feedback
    void executeCreationFlow({ title, amount, listId });
  });

  useSpeechRecognitionEvent('error', (event: SpeechErrorEvent) => {
    const nextMessage = getErrorMessageFromEvent(event);
    setRecognizing(false);
    setErrorMessage(nextMessage);

    showToast({
      type: 'error',
      title: 'Falha no reconhecimento de voz',
      subtitle: nextMessage,
    });
  });

  const hasGranted = useCallback(async (): Promise<boolean> => {
    try {
      return await requestSpeechPermission();
    } catch {
      const message = 'Permissao de microfone e obrigatoria para continuar.';
      setErrorMessage(message);
      showToast({
        type: 'warning',
        title: 'Permissao necessaria',
        subtitle: message,
      });
      return false;
    }
  }, []);

  const handleStart = useCallback(
    async (reason: 'manual' | 'auto' = 'manual'): Promise<boolean> => {
      const attempt = ++startAttemptRef.current;
      const granted = await hasGranted();

      if (!granted) {
        return false;
      }

      if (
        attempt !== startAttemptRef.current ||
        (reason === 'auto' && directModeRef.current !== 'auto')
      ) {
        return false;
      }

      setErrorMessage(null);
      startSpeechRecognition();

      return true;
    },
    [hasGranted],
  );

  const handleStop = useCallback(() => {
    stopSpeechRecognition();
  }, []);

  const handleReset = useCallback(() => {
    setTranscript('');
    setErrorMessage(null);
  }, []);

  const handleDirectModeChange = useCallback((value: 'manual' | 'auto') => {
    startAttemptRef.current += 1;
    setDirectMode(value);

    if (value === 'manual') {
      stopSpeechRecognition();
    }
  }, []);

  useEffect(() => {
    if (directMode === 'manual') {
      return;
    }

    const timer = setTimeout(() => {
      void handleStart('auto');
    }, 450);

    return () => {
      clearTimeout(timer);
      stopSpeechRecognition();
    };
  }, [directMode, handleStart]);

  return {
    recognizing,
    transcript,
    errorMessage,
    directMode,
    chatMessages,
    handleStart,
    handleStop,
    handleReset,
    handleDirectModeChange,
  };
};
