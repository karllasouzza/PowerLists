export type VoiceAssistantStatus = 'idle' | 'listening' | 'processing' | 'error';

export interface UserMessage {
  type: 'user';
  text: string;
}

interface AssistantMessage {
  type: 'assistant';
  text: string;
}

export interface AssistantAcknowledgmentMessage {
  id: string;
  type: 'assistant-acknowledgment';
  text: string;
  item: {
    title: string;
    amount: number;
    status: 'processing' | 'success' | 'error';
  };
}

export type ChatMessage = UserMessage | AssistantMessage | AssistantAcknowledgmentMessage;

export interface SpeechResult {
  transcript?: string;
}

export interface SpeechResultEvent {
  isFinal?: boolean;
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
