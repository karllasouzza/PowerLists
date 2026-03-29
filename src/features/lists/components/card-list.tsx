import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { IconShoppingCart, IconEdit, IconTrash } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { useValue } from '@legendapp/state/react';

import { List } from '@/data/types';
import type { ListItem } from '@/features/list_items';
import { listItems$ } from '@/data/states/list-items';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { SwipeableItem, type SwipeableItemRef } from '@/components/swipeable';
import { calculateTotal } from '@/features/list_items';
import { getAccentColorCardClasses } from '@/features/lists/utils/accent-colors';
import { iconMap } from '@/features/lists/utils/icon-map';
import { cn } from '@/lib/utils';

const ACTION_WIDTH = 84;
const ACTIONS_TOTAL_WIDTH = ACTION_WIDTH * 2;

interface CardListProps {
  list: List;
  onEdit: (listId: string) => void;
  onDelete: (listId: string) => void;
}

export const CardList = function CardList({ list, onEdit, onDelete }: CardListProps) {
  const router = useRouter();
  const swipeableRef = useRef<SwipeableItemRef>(null);

  const listItemsRaw = useValue(listItems$);
  const items = useMemo(() => {
    const raw = Object.values(listItemsRaw || {}).filter((item) => item.list_id === list.id);
    return convertFromSupabaseFormat(raw) as ListItem[];
  }, [listItemsRaw, list.id]);
  const cardIcon = iconMap[list.icon] ?? IconShoppingCart;
  const totalPrice = calculateTotal(items);
  const { backgroundClassName, foregroundClassName } = getAccentColorCardClasses(list.accentColor);

  const handlePress = () => {
    router.push({
      pathname: '/(authenticated)/lists/[id]',
      params: { id: list.id },
    });
  };

  const handleEdit = useCallback(() => {
    swipeableRef.current?.close();
    onEdit(list.id);
  }, [list.id, onEdit]);

  const handleDelete = useCallback(() => {
    swipeableRef.current?.close();
    onDelete(list.id);
  }, [list.id, onDelete]);

  const renderRightActions = useCallback(
    () => (
      <View className="h-full flex-row" style={{ width: ACTIONS_TOTAL_WIDTH }}>
        <Pressable
          onPress={handleEdit}
          className="items-center justify-center bg-secondary"
          style={{ width: ACTION_WIDTH }}>
          <Icon as={IconEdit} size={20} className="text-secondary-foreground" />
          <Text className="mt-1 text-xs font-semibold text-secondary-foreground">Editar</Text>
        </Pressable>

        <Pressable
          onPress={handleDelete}
          className="items-center justify-center bg-destructive"
          style={{ width: ACTION_WIDTH }}>
          <Icon as={IconTrash} size={20} className="text-destructive-foreground" />
          <Text className="mt-1 text-xs font-semibold text-destructive-foreground">Deletar</Text>
        </Pressable>
      </View>
    ),
    [handleDelete, handleEdit],
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
            'size-[50px] rounded-full overflow-hidden flex items-center justify-center',
            backgroundClassName,
          )}>
          <Icon as={cardIcon} size={24} className={foregroundClassName} />
        </View>
        <View className="flex-1 flex-col items-start justify-center">
          <Text variant="p" className="tracking-normal mt-0">
            {list.title}
          </Text>
          <Text variant="p" className="tracking-normal font-bold mt-1">
            {totalPrice}
          </Text>
        </View>
      </Pressable>
    </SwipeableItem>
  );
};
