import { View } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { IconLoader2, IconSquareRoundedCheck, IconX } from '@tabler/icons-react-native';

import type { AssistantAcknowledgmentMessage } from '../types';

type Props = Pick<AssistantAcknowledgmentMessage, 'text' | 'item'>;

export const AssistantAcknowledgmentCard = ({ text, item }: Props) => {
  return (
    <View className="max-w-[84%] self-start gap-2">
      <View className="rounded-2xl rounded-bl-none bg-card px-4 py-3">
        <Text className="text-sm text-foreground">{text}</Text>
      </View>

      <View className="flex w-full flex-row items-center justify-between rounded-2xl border border-border bg-card p-3 py-4">
        <View className="flex flex-1 flex-col gap-1">
          <Text className="flex-1 truncate text-sm font-medium text-foreground">{item.title}</Text>
          <Text className="text-xs font-semibold text-muted-foreground">{item.amount} und</Text>
        </View>

        <Icon
          as={
            item.status === 'processing'
              ? IconLoader2
              : item.status === 'success'
                ? IconSquareRoundedCheck
                : IconX
          }
          size={22}
          className={
            item.status === 'processing'
              ? 'text-muted-foreground'
              : item.status === 'success'
                ? 'text-success'
                : 'text-destructive'
          }
        />
      </View>
    </View>
  );
};
