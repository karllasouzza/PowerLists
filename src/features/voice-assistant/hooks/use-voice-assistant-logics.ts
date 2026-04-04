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
import { createAudioQueue } from '../services/audio-queue';
import { parseTranscript } from '../utils/parse-transcript';
import type { ChatMessage, SpeechErrorEvent, SpeechResultEvent } from '../types';
import useAssistantAudios from './use-assistant-audios';
import { useListItemCreationFlow } from './use-list-item-creation-flow';

export const useVoiceAssistantLogics = (listId: string) => {
  const [recognizing, setRecognizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [directMode, setDirectMode] = useState<'manual' | 'auto'>('manual');
  const directModeRef = useRef<'manual' | 'auto'>(directMode);
  const startAttemptRef = useRef(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const { current: playAudio } = useRef(createAudioQueue());

  const {
    assistantCourtesyPlayer,
    addingListItemPlayer,
    successPlayer,
    assistantNewItemPlayer,
    errorPlayer,
    errorNotificationPlayer,
  } = useAssistantAudios();

  const { executeCreationFlow } = useListItemCreationFlow(
    setChatMessages,
    {
      addingListItemPlayer,
      successPlayer,
      assistantNewItemPlayer,
      errorPlayer,
      errorNotificationPlayer,
    },
    playAudio,
  );

  useEffect(() => {
    directModeRef.current = directMode;
  }, [directMode]);

  useEffect(() => {
    const initialize = async () => {
      if (chatMessages.length === 0) {
        setChatMessages([
          { type: 'assistant', text: 'Olá, qual item gostaria de adicionar na lista hoje?' },
        ]);
        await playAudio(assistantCourtesyPlayer);
      }
    };

    void initialize();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    stopSpeechRecognition();

    setChatMessages((prev) => [...prev, { type: 'user', text: nextTranscript }]);

    void executeCreationFlow({ title, amount, listId });

    if (directMode === 'auto') {
      void handleStart('auto');
    }
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
      const granted = await requestSpeechPermission();

      if (!granted) {
        const message = 'Permissão de microfone é obrigatória para continuar.';
        setErrorMessage(message);
        showToast({
          type: 'warning',
          title: 'Permissão necessária',
          subtitle: message,
        });
        return false;
      }

      return true;
    } catch {
      const message = 'Permissão de microfone é obrigatória para continuar.';
      setErrorMessage(message);
      showToast({
        type: 'warning',
        title: 'Permissão necessária',
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

  const handleReset = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleStop = useCallback(() => {
    stopSpeechRecognition();
    handleReset();
  }, [handleReset]);

  const handleDirectModeChange = useCallback((value: 'manual' | 'auto') => {
    startAttemptRef.current += 1;
    stopSpeechRecognition();
    setDirectMode(value);
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

  // Ensure speech recognition is stopped unconditionally when the hook/component unmounts
  useEffect(() => {
    return () => {
      stopSpeechRecognition();
    };
  }, []);

  return {
    recognizing,
    errorMessage,
    directMode,
    chatMessages,
    handleStart,
    handleStop,
    handleReset,
    handleDirectModeChange,
  };
};
