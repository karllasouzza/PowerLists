import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export const AssistantMessage = ({ text }: { text: string }) => {
  return (
    <View className="max-w-[84%] self-start rounded-2xl bg-card px-4 py-3">
      <Text className="text-sm text-foreground">{text}</Text>
    </View>
  );
};
