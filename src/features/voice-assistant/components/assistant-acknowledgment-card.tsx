import { View } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import {
  IconLoader2,
  IconRobotFace,
  IconSquareRoundedCheck,
  IconX,
} from '@tabler/icons-react-native';

import type { AssistantAcknowledgmentMessage } from '../types';
import { useMemo } from 'react';

type Props = Pick<AssistantAcknowledgmentMessage, 'text' | 'item'>;

export const AssistantAcknowledgmentCard = ({ text, item }: Props) => {
  const itemStatusClass = useMemo(() => {
    return item.status === 'processing'
      ? 'text-muted-foreground animate-pulse'
      : item.status === 'success'
        ? 'text-success'
        : 'text-destructive';
  }, [item.status]);

  const IconComponent = useMemo(() => {
    if (item.status === 'processing') {
      return IconLoader2;
    }

    if (item.status === 'success') {
      return IconSquareRoundedCheck;
    }

    if (item.status === 'error') {
      return IconX;
    }

    return IconRobotFace;
  }, [item.status]);

  return (
    <View className="max-w-[84%] self-start flex flex-row gap-2 items-end">
      <View className="rounded-lg bg-muted flex items-center justify-center p-2">
        <Icon as={IconRobotFace} size={24} className="text-muted-foreground" />
      </View>
      <View className="w-full self-start rounded-2xl rounded-bl-none bg-muted px-4 py-3">
        <View className="rounded-2xl rounded-bl-none bg-muted px-4 py-3">
          <Text className="text-sm text-foreground">{text}</Text>
        </View>

        <View className="flex w-full flex-row items-center justify-between rounded-2xl border border-border bg-card p-4">
          <View className="flex flex-1 flex-col gap-1">
            <Text variant="p" className="flex-1 truncate font-medium text-foreground m-0 p-0">
              {item.title}
            </Text>
            <Text variant="small" className="text-muted-foreground m-0 p-0">
              {item.amount} unidades
            </Text>
          </View>

          <Icon as={IconComponent} size={26} className={itemStatusClass} />
        </View>
      </View>
    </View>
  );
};
