import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { SwipeableItem, type SwipeableItemRef } from '@/components/swipeable';
import { cn } from '@/lib/utils';
import { ListItemRightActions } from '@/features/list_items/components/list-item-right-actions';
import { ListItemLeftActions } from '@/features/list_items/components/list-item-left-actions';

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

  const closeSwipeable = useCallback(() => {
    swipeableRef.current?.close();
  }, []);

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
      <ListItemRightActions
        itemId={id}
        onEdit={onEdit}
        onDelete={onDelete}
        closeSwipeable={closeSwipeable}
      />
    ),
    [closeSwipeable, id, onDelete, onEdit],
  );

  const renderLeftActions = useCallback(
    () => (
      <ListItemLeftActions
        status={status}
        accentBgClassName={accentBgClassName}
        accentForegroundClassName={accentForegroundClassName}
        closeSwipeable={closeSwipeable}
        onCheck={checkHandle}
      />
    ),
    [accentBgClassName, accentForegroundClassName, checkHandle, closeSwipeable, status],
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
            {price} x {amount} und
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
