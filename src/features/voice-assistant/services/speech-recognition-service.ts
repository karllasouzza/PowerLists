import { ExpoSpeechRecognitionModule, ExpoSpeechRecognitionOptions } from 'expo-speech-recognition';

import type { SpeechErrorEvent, SpeechResultEvent } from '../types';

const DEFAULT_SPEECH_OPTIONS: ExpoSpeechRecognitionOptions = {
  lang: 'pt-BR',
  interimResults: true,
  continuous: true,
};

const ERROR_MESSAGES: Record<string, string> = {
  'not-allowed': 'Permissão de microfone negada.',
  'service-not-allowed': 'Permissão de voz não autorizada.',
  'audio-capture': 'Não foi possível acessar o microfone.',
  'no-speech': 'Não detectamos nenhuma fala. Tente novamente.',
  aborted: 'Reconhecimento de voz interrompido.',
  network: 'Falha de rede durante o reconhecimento de voz.',
};

export const requestSpeechPermission = async (): Promise<boolean> => {
  try {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    return Boolean(result.granted);
  } catch {
    return false;
  }
};

export const startSpeechRecognition = (options?: ExpoSpeechRecognitionOptions): void => {
  ExpoSpeechRecognitionModule.start({
    ...DEFAULT_SPEECH_OPTIONS,
    ...options,
  });
};

export const stopSpeechRecognition = (): void => {
  ExpoSpeechRecognitionModule.stop();
};

export const getTranscriptFromResultEvent = (event: SpeechResultEvent): string => {
  if (!event.isFinal) return '';
  return event.results?.[0]?.transcript?.trim() ?? '';
};

export const getErrorMessageFromEvent = (event: SpeechErrorEvent): string => {
  const normalizedError = event.error?.trim().toLowerCase();

  if (normalizedError && ERROR_MESSAGES[normalizedError]) {
    return ERROR_MESSAGES[normalizedError];
  }

  const fallback = event.message?.trim();
  if (fallback) {
    return fallback;
  }

  return 'Erro desconhecido ao reconhecer voz.';
};
