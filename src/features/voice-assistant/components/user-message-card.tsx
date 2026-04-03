import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { UserMessage } from '../types';

export const UserMessageCard = ({ text }: UserMessage) => {
  return (
    <View className="max-w-[64%] self-end rounded-2xl rounded-br-none border border-border bg-primary/30 p-3">
      <Text className="text-sm text-muted-foreground">{text}</Text>
    </View>
  );
};
