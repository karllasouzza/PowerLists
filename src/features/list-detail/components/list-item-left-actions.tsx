import React, { useCallback } from 'react';
import { View } from 'react-native';
import { IconSquareRoundedCheck, IconSquareRoundedMinus } from '@tabler/icons-react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

interface ListItemLeftActionsProps {
  status: boolean;
  accentBgClassName: string;
  accentForegroundClassName: string;
  closeSwipeable: () => void;
  onCheck: () => void;
}

function ListItemLeftActionsComponent({
  status,
  accentBgClassName,
  accentForegroundClassName,
  closeSwipeable,
  onCheck,
}: ListItemLeftActionsProps) {
  const handleCheck = useCallback(() => {
    closeSwipeable();
    onCheck();
  }, [closeSwipeable, onCheck]);

  return (
    <View className="h-full flex flex-row w-32 justify-end p-1 bg-background overflow-hidden box-border">
      <Button
        onPress={handleCheck}
        variant="secondary"
        className={cn('justify-center h-full flex-col items-center w-full', accentBgClassName)}
        style={{ opacity: status ? 0.7 : 1 }}>
        <Icon
          as={status ? IconSquareRoundedMinus : IconSquareRoundedCheck}
          size={24}
          className={cn('text-secondary-foreground', accentForegroundClassName)}
        />
        <Text className={cn('font-semibold', accentForegroundClassName)}>
          {status ? 'Desmarcar' : 'Marcar'}
        </Text>
      </Button>
    </View>
  );
}

export const ListItemLeftActions = React.memo(ListItemLeftActionsComponent);
