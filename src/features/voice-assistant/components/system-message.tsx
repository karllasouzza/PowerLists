import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export const SystemMessageBubble = ({ text }: { text: string }) => {
  return (
    <View className="self-center rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3">
      <Text className="text-center text-sm text-destructive">{text}</Text>
    </View>
  );
};
