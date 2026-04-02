import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { Decimal } from 'decimal.js';

import { Text } from '@/components/ui/text';
import { SwipeableItem, type SwipeableItemRef } from '@/components/swipeable';
import { cn } from '@/lib/utils';

import { ListItemLeftActions } from './list-item-left-actions';
import { ListItemRightActions } from './list-item-right-actions';
import { formatCurrency } from '../utils';

interface ListItemProps {
  id: string;
  title: string;
  price: number;
  amount: number;
  status: boolean;
  accentBgClassName: string;
  accentForegroundClassName: string;
  checkHandle: () => void;
  onEdit: (itemId: string) => void;
  onDelete: (itemId: string) => void;
}

function ListItemCard({
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
        <View className="flex-1 flex-row justify-between">
          <View className="flex-1 justify-center gap-0.5">
            <Text
              className={cn(
                'text-base font-semibold',
                status ? 'text-muted-foreground line-through' : 'text-foreground',
              )}
              numberOfLines={1}>
              {title}
            </Text>
            <Text variant="muted" className="text-sm">
              {amount} unidades
            </Text>
          </View>
          <View className="justify-center items-end">
            <View
              className={cn(
                'flex items-center justify-center font-bold p-1 rounded-full',
                accentBgClassName,
                accentForegroundClassName,
              )}>
              <Text
                variant="small"
                className={cn('font-bold !p-0 !m-0', accentForegroundClassName)}>
                {formatCurrency(new Decimal(price).mul(amount ?? 0).toNumber() ?? 0)}
              </Text>
            </View>

            <Text variant="muted" className="text-sm">
              {formatCurrency(price)} und
            </Text>
          </View>
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

const ListItem = React.memo(ListItemCard, areListItemPropsEqual);

export default ListItem;
