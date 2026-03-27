import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { IconCheck, IconPencil, IconTrash } from '@tabler/icons-react-native';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

const ACTION_WIDTH = 84;
const ACTIONS_TOTAL_WIDTH = ACTION_WIDTH * 2;

type SwipeableInstance = React.ElementRef<typeof Swipeable>;

let openedSwipeable: SwipeableInstance | null = null;

export const closeOpenedListItemSwipe = () => {
  if (openedSwipeable) {
    openedSwipeable.close();
    openedSwipeable = null;
  }
};

interface ListItemProps {
  id: string;
  title: string;
  price: string;
  amount: string;
  status: boolean;
  checkHandle: () => void;
  onEdit: (itemId: string) => void;
  onDelete: (itemId: string) => void;
}

export default function ListItem({
  id,
  title,
  price,
  amount,
  status,
  checkHandle,
  onEdit,
  onDelete,
}: ListItemProps) {
  const swipeableRef = useRef<SwipeableInstance>(null);

  const handleSwipeWillOpen = useCallback(() => {
    if (openedSwipeable && openedSwipeable !== swipeableRef.current) {
      openedSwipeable.close();
    }

    openedSwipeable = swipeableRef.current;
  }, []);

  const handleSwipeClose = useCallback(() => {
    if (openedSwipeable === swipeableRef.current) {
      openedSwipeable = null;
    }
  }, []);

  const handleEdit = useCallback(() => {
    swipeableRef.current?.close();
    onEdit(id);
  }, [id, onEdit]);

  const handleDelete = useCallback(() => {
    swipeableRef.current?.close();
    onDelete(id);
  }, [id, onDelete]);

  const handleSwipeOpen = useCallback(
    (direction: 'left' | 'right') => {
      if (direction === 'right') {
        swipeableRef.current?.close();
        checkHandle();
      }
    },
    [checkHandle],
  );

  useEffect(() => {
    const currentSwipeable = swipeableRef.current;

    return () => {
      if (openedSwipeable === currentSwipeable) {
        openedSwipeable = null;
      }
    };
  }, []);

  const renderRightActions = useCallback(
    () => (
      <View className="h-full flex-row" style={{ width: ACTIONS_TOTAL_WIDTH }}>
        <Pressable
          onPress={handleEdit}
          className="items-center justify-center bg-secondary"
          style={{ width: ACTION_WIDTH }}>
          <Icon as={IconPencil} size={20} className="text-secondary-foreground" />
          <Text className="mt-1 text-xs font-semibold text-secondary-foreground">Editar</Text>
        </Pressable>
        <Pressable
          onPress={handleDelete}
          className="items-center justify-center bg-destructive"
          style={{ width: ACTION_WIDTH }}>
          <Icon as={IconTrash} size={20} color="#fff" />
          <Text className="mt-1 text-xs font-semibold text-white">Deletar</Text>
        </Pressable>
      </View>
    ),
    [handleDelete, handleEdit],
  );

  const renderLeftActions = useCallback(
    () => (
      <View className="h-full flex-row justify-end" style={{ width: ACTION_WIDTH }}>
        <View
          className={cn('items-center justify-center', !status ? 'bg-primary' : 'bg-destructive')}
          style={{ width: ACTION_WIDTH }}>
          <Icon as={IconCheck} size={20} className="text-primary-foreground" />
          <Text className="mt-1 text-xs font-semibold text-primary-foreground">
            {status ? 'Desmarcar' : 'Marcar'}
          </Text>
        </View>
      </View>
    ),
    [status],
  );

  return (
    <View className="mx-4 mb-2 overflow-hidden rounded-2xl">
      <Swipeable
        ref={swipeableRef}
        friction={4}
        leftThreshold={42}
        rightThreshold={42}
        overshootLeft={false}
        overshootRight={false}
        dragOffsetFromLeftEdge={15}
        dragOffsetFromRightEdge={15}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={handleSwipeWillOpen}
        onSwipeableOpen={handleSwipeOpen}
        onSwipeableWillClose={handleSwipeClose}
        onSwipeableClose={handleSwipeClose}>
        <View className="min-h-[88px] h-max w-full flex-row items-center gap-3 bg-card p-3">
          <View
            className="rounded-xl items-center justify-center overflow-hidden"
            style={{
              width: 64,
              height: 64,
            }}>
            <Text className="text-2xl font-bold text-foreground">
              {(title || '?').charAt(0).toUpperCase()}
            </Text>
          </View>

          <View className="flex-1 justify-center gap-0.5">
            <Text
              className="text-base font-semibold text-foreground"
              style={{ textDecorationLine: status ? 'line-through' : 'none' }}
              numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {price} • {amount} und
            </Text>
          </View>
        </View>
      </Swipeable>
    </View>
  );
}
