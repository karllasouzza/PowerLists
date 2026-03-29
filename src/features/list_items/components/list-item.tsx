import React, { useCallback, useRef } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { SwipeableItem, type SwipeableItemRef } from '@/components/swipeable';
import { IconCheck, IconPencil, IconTrash } from '@tabler/icons-react-native';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

const ACTION_WIDTH = 84;
const ACTIONS_TOTAL_WIDTH = ACTION_WIDTH * 2;

interface ListItemProps {
  id: string;
  title: string;
  price: string;
  amount: string;
  status: boolean;
  accentBgClassName: string;
  accentForegroundClassName: string;
  checkHandle: () => void;
  onEdit: (itemId: string) => void;
  onDelete: (itemId: string) => void;
}

function ListItemComponent({
  id,
  title,
  price,
  amount,
  status,
  accentBgClassName,
  accentForegroundClassName,
  checkHandle,
  onEdit,
  onDelete,
}: ListItemProps) {
  const swipeableRef = useRef<SwipeableItemRef>(null);

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

  const renderRightActions = useCallback(
    () => (
      <View className="h-full flex-row" style={{ width: ACTIONS_TOTAL_WIDTH }}>
        <Pressable
          onPress={handleEdit}
          className="items-center justify-center bg-warning"
          style={{ width: ACTION_WIDTH }}>
          <Icon as={IconPencil} size={20} className="text-warning-foreground" />
          <Text className="mt-1 text-xs font-semibold text-warning-foreground">Editar</Text>
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
          className={cn('items-center justify-center', accentBgClassName)}
          style={{ width: ACTION_WIDTH }}>
          <Icon as={IconCheck} size={20} className={accentForegroundClassName} />
          <Text className={cn('mt-1 text-xs font-semibold', accentForegroundClassName)}>
            {status ? 'Desmarcar' : 'Marcar'}
          </Text>
        </View>
      </View>
    ),
    [accentBgClassName, accentForegroundClassName, status],
  );

  return (
    <SwipeableItem
      ref={swipeableRef}
      friction={1.2}
      leftThreshold={46}
      rightThreshold={42}
      dragOffsetFromLeftEdge={10}
      dragOffsetFromRightEdge={12}
      overshootLeft
      overshootRight
      overshootFriction={8}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onOpen={handleSwipeOpen}>
      <View className="min-h-[88px] h-max w-full flex-row items-center gap-3 bg-card p-3 overflow-hidden">
        <View
          className={cn(
            'rounded-xl items-center justify-center overflow-hidden',
            accentBgClassName,
          )}
          style={{
            width: 64,
            height: 64,
          }}>
          <Text className={cn('text-2xl font-bold', accentForegroundClassName)}>
            {(title || '?').charAt(0).toUpperCase()}
          </Text>
        </View>

        <View className="flex-1 justify-center gap-0.5">
          <Text
            className={cn(
              'text-base font-semibold',
              status ? 'text-muted-foreground line-through' : 'text-foreground',
            )}
            numberOfLines={1}>
            {title}
          </Text>
          <Text className={cn('text-sm', status ? 'text-muted-foreground' : 'text-foreground')}>
            {price} • {amount} und
          </Text>
        </View>
      </View>
    </SwipeableItem>
  );
}

const areListItemPropsEqual = (prev: ListItemProps, next: ListItemProps) =>
  prev.id === next.id &&
  prev.title === next.title &&
  prev.price === next.price &&
  prev.amount === next.amount &&
  prev.status === next.status &&
  prev.accentBgClassName === next.accentBgClassName &&
  prev.accentForegroundClassName === next.accentForegroundClassName;

const ListItem = React.memo(ListItemComponent, areListItemPropsEqual);

export default ListItem;
