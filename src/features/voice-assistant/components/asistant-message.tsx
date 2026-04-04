import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { IconRobotFace } from '@tabler/icons-react-native';
import { View } from 'react-native';

export const AssistantMessage = ({ text }: { text: string }) => {
  return (
    <View className="max-w-[84%] self-start flex flex-row gap-2 items-end">
      <View className="rounded-lg bg-muted flex items-center justify-center p-2">
        <Icon as={IconRobotFace} size={24} className="text-muted-foreground" />
      </View>

      <View className="max-w-[84%] self-start rounded-2xl rounded-bl-none bg-muted px-4 py-3">
        <Text className="text-sm text-foreground">{text}</Text>
      </View>
    </View>
  );
};
