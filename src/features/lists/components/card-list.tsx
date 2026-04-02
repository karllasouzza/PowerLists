import React, { useCallback, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { IconShoppingCart } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { useSelector } from '@legendapp/state/react';

import { List } from '@/data/types';
import type { ListItem } from '@/features/list_items';
import { listItems$ } from '@/data/states/list-items';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { SwipeableItem, type SwipeableItemRef } from '@/components/swipeable';
import { calculateTotal } from '@/features/list_items';
import { CardListRightActions } from '@/features/lists/components/card-list-right-actions';
import { getAccentColorCardClasses } from '@/features/lists/utils/accent-colors';
import { iconMap } from '@/features/lists/utils/icon-map';
import { cn } from '@/lib/utils';

interface CardListProps {
  list: List;
  onEdit: (listId: string) => void;
  onDelete: (listId: string) => void;
}

function CardListComponent({ list, onEdit, onDelete }: CardListProps) {
  const router = useRouter();
  const swipeableRef = useRef<SwipeableItemRef>(null);

  const items = useSelector(() => {
    const raw = Object.values(listItems$.get() ?? {}).filter((item) => item.list_id === list.id);
    return convertFromSupabaseFormat(raw) as ListItem[];
  });
  const cardIcon = iconMap[list.icon] ?? IconShoppingCart;
  const totalPrice = calculateTotal(items);
  const { backgroundClassName, foregroundClassName } = getAccentColorCardClasses(list.accentColor);

  const handlePress = () => {
    router.push({
      pathname: '/list',
      params: { id: list.id },
    });
  };

  const closeSwipeable = useCallback(() => {
    swipeableRef.current?.close();
  }, []);

  const renderRightActions = useCallback(
    () => (
      <CardListRightActions
        listId={list.id}
        onEdit={onEdit}
        onDelete={onDelete}
        closeSwipeable={closeSwipeable}
      />
    ),
    [closeSwipeable, list.id, onDelete, onEdit],
  );

  return (
    <SwipeableItem
      ref={swipeableRef}
      friction={1.35}
      rightThreshold={52}
      dragOffsetFromRightEdge={14}
      overshootRight={false}
      renderRightActions={renderRightActions}>
      <Pressable onPress={handlePress} className="flex-row items-center gap-3 bg-card px-4 py-4">
        <View
          className={cn(
            'flex justify-center items-center rounded-lg size-[50px] overflow-hidden',
            backgroundClassName,
          )}>
          <Icon as={cardIcon} size={24} className={foregroundClassName} />
        </View>
        <View className="flex-col flex-1 justify-center items-start">
          <Text variant="p" className="mt-0 tracking-normal">
            {list.title}
          </Text>
          <Text variant="p" className="mt-1 font-bold tracking-normal">
            {totalPrice}
          </Text>
        </View>
      </Pressable>
    </SwipeableItem>
  );
}

const areCardListPropsEqual = (prev: CardListProps, next: CardListProps) =>
  prev.list.id === next.list.id &&
  prev.list.title === next.list.title &&
  prev.list.icon === next.list.icon &&
  prev.list.accentColor === next.list.accentColor &&
  prev.onEdit === next.onEdit &&
  prev.onDelete === next.onDelete;

export const CardList = React.memo(CardListComponent, areCardListPropsEqual);
