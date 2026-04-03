import type { ChatMessage } from '../types';
import { AssistantAcknowledgmentCard } from './assistant-acknowledgment-card';
import { AssistantMessage } from './asistant-message';
import { UserMessageCard } from './user-message-card';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  if (message.type === 'assistant') {
    return <AssistantMessage text={message.text} />;
  }

  if (message.type === 'assistant-acknowledgment') {
    return <AssistantAcknowledgmentCard text={message.text} item={message.item} />;
  }

  return <UserMessageCard {...message} />;
};
