export type VoiceAssistantStatus = 'idle' | 'listening' | 'processing' | 'error';

export interface SpeechResult {
  transcript?: string;
}

export interface SpeechResultEvent {
  results?: SpeechResult[];
}

export interface SpeechErrorEvent {
  error?: string;
  message?: string;
}

export interface SpeechStartOptions {
  lang?: string;
  interimResults?: boolean;
  continuous?: boolean;
}
