import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {
  IconBook,
  IconCheck,
  IconChefHat,
  IconShoppingCart,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';

import { List } from '@/data/types';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { calculateTotal } from '@/features/list_items';

const ACTION_WIDTH = 84;
const ACTIONS_TOTAL_WIDTH = ACTION_WIDTH * 2;

type SwipeableInstance = React.ElementRef<typeof Swipeable>;

let openedSwipeable: SwipeableInstance | null = null;

interface CardListProps {
  list: List;
  toggleSelectList: (id: string) => void;
  isSelected: (listId: string) => string | undefined;
  listsSelected: string[];
  onEdit: (listId: string) => void;
  onDelete: (listId: string) => void;
}

const CardIcons = {
  cart: IconShoppingCart,
  'chef-hat': IconChefHat,
  book: IconBook,
} as const;

export const CardList = ({
  list,
  toggleSelectList,
  isSelected,
  listsSelected,
  onEdit,
  onDelete,
}: CardListProps) => {
  const router = useRouter();
  const swipeableRef = useRef<SwipeableInstance>(null);

  const items = list.listItems || [];
  const boughtCount = items.filter((item: any) => item?.isChecked === true).length;
  const totalCount = items.length;
  const cardIcon = CardIcons[list.icon as keyof typeof CardIcons] || IconShoppingCart;
  const totalPrice = calculateTotal(items);

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

  const handleRouterPush = () => {
    router.push({
      pathname: '/(authenticated)/lists/[id]',
      params: { id: list.id },
    });
  };
  const handleSelect = () => toggleSelectList(list.id);
  const handlePress = () => {
    if (listsSelected.length > 0) {
      handleSelect();
    } else {
      handleRouterPush();
    }
  };
  const handleLongPress = () => {
    toggleSelectList(list.id);
  };

  const handleEdit = useCallback(() => {
    swipeableRef.current?.close();
    onEdit(list.id);
  }, [list.id, onEdit]);

  const handleDelete = useCallback(() => {
    swipeableRef.current?.close();
    onDelete(list.id);
  }, [list.id, onDelete]);

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
          <Icon as={IconEdit} size={20} className="text-secondary-foreground" />
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

  return (
    <View className="mx-4 mb-2 overflow-hidden rounded-2xl">
      <Swipeable
        ref={swipeableRef}
        friction={2}
        rightThreshold={42}
        overshootRight={false}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={handleSwipeWillOpen}
        onSwipeableWillClose={handleSwipeClose}
        onSwipeableClose={handleSwipeClose}>
        <Pressable
          onPress={handlePress}
          onLongPress={handleLongPress}
          className={cn(
            'flex-row items-center justify-between bg-card px-4 py-4',
            isSelected(list.id) && 'bg-primary/15',
          )}>
          <View className="flex-1 flex-row items-center gap-3">
            <View className="size-[50px] rounded-full flex items-center justify-center">
              {isSelected(list.id) ? (
                <Icon as={IconCheck} size={24} className="text-foreground" />
              ) : (
                <Icon as={cardIcon} size={24} className="text-foreground" />
              )}
            </View>

            <View className="flex flex-col items-start justify-center">
              <Text variant="p" className="tracking-normal mt-0">
                {list.title}
              </Text>
              <Text variant="muted" className="text-sm tracking-tight">
                <Text className="text-primary">{boughtCount}</Text>/{totalCount} compradas
              </Text>
            </View>
          </View>

          <View className="items-end justify-center">
            <Text variant="p" className="tracking-normal font-bold">
              {totalPrice}
            </Text>
          </View>
        </Pressable>
      </Swipeable>
    </View>
  );
};
