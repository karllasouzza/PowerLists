import { Text } from '@/components/ui/text';
import { View } from 'react-native';

import type { ChatMessage } from '../types';
import { AssistantAcknowledgmentCard } from './assistant-acknowledgment-card';
import { AssistantMessage } from './asistant-message';
import { SystemMessageBubble } from './system-message';
import { UserMessageCard } from './user-message-card';

interface TranscriptSectionProps {
  messages: ChatMessage[];
  recognizing: boolean;
}

export const TranscriptSection = ({
  messages,
  recognizing: _recognizing,
}: TranscriptSectionProps) => {
  return (
    <View className="w-full gap-3 px-1">
      <View className="max-w-[84%] self-start rounded-2xl bg-card px-4 py-3">
        <Text className="text-sm text-foreground">O que gostaria de adicionar na lista hoje?</Text>
      </View>

      {messages.map((msg, index) => {
        if (msg.type === 'assistant') {
          return <AssistantMessage key={index} text={msg.text} />;
        }

        if (msg.type === 'assistant-acknowledgment') {
          return <AssistantAcknowledgmentCard key={index} text={msg.text} item={msg.item} />;
        }

        if (msg.type === 'system') {
          return <SystemMessageBubble key={index} text={msg.text} />;
        }

        return <UserMessageCard key={index} {...msg} />;
      })}
    </View>
  );
};
