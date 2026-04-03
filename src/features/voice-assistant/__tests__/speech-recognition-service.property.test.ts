import {
  getErrorMessageFromEvent,
  getTranscriptFromResultEvent,
  requestSpeechPermission,
  startSpeechRecognition,
  stopSpeechRecognition,
} from '@/features/voice-assistant/services/speech-recognition-service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';

jest.mock('expo-speech-recognition', () => ({
  ExpoSpeechRecognitionModule: {
    requestPermissionsAsync: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  },
}));

describe('speech-recognition-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns false when speech permission is denied', async () => {
    jest.mocked(ExpoSpeechRecognitionModule.requestPermissionsAsync).mockResolvedValue({
      granted: false,
    } as never);

    const result = await requestSpeechPermission();

    expect(result).toBe(false);
  });

  it('starts recognition with defaults in pt-BR', () => {
    startSpeechRecognition();

    expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith({
      lang: 'pt-BR',
      interimResults: true,
      continuous: true,
    });
  });

  it('stops recognition', () => {
    stopSpeechRecognition();

    expect(ExpoSpeechRecognitionModule.stop).toHaveBeenCalledTimes(1);
  });

  it('extracts transcript from first result', () => {
    const transcript = getTranscriptFromResultEvent({
      results: [{ transcript: 'comprar arroz' }],
      isFinal: true,
    });

    expect(transcript).toBe('comprar arroz');
  });

  it('maps unknown error payload to fallback message', () => {
    const message = getErrorMessageFromEvent({ error: 'xpto', message: '' });

    expect(message).toBe('Erro desconhecido ao reconhecer voz.');
  });
});
