import React from 'react';
import { Pressable, View } from 'react-native';
import { IconBook, IconCheck, IconChefHat, IconShoppingCart } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';

import { List } from '@/data/types';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { calculateTotal } from '@/features/list_items';

interface CardListProps {
  list: List;
  toggleSelectList: (id: string) => void;
  isSelected: (listId: string) => string | undefined;
  listsSelected: string[];
}

const CardIcons = {
  cart: IconShoppingCart,
  'chef-hat': IconChefHat,
  book: IconBook,
} as const;

export const CardList = ({ list, toggleSelectList, isSelected, listsSelected }: CardListProps) => {
  const router = useRouter();

  const items = list.listItems || [];
  const boughtCount = items.filter((item: any) => item?.isChecked === true).length;
  const totalCount = items.length;
  const accentColorClass = list.accentColor ? `bg-${list.accentColor}` : 'bg-primary';
  console.log('accentColorClass', accentColorClass);
  const cardIcon = CardIcons[list.icon as keyof typeof CardIcons] || IconShoppingCart;
  const totalPrice = calculateTotal(items);

  const handleRouterPush = () => {
    router.push({
      pathname: 'lists/[id]',
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

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      className={cn(
        'flex-row items-center justify-between px-4 py-4',
        isSelected(list.id) && 'bg-primary/15',
      )}>
      {/* Left Section: Avatar + Title/Description */}
      <View className="flex-1 flex-row items-center gap-3">
        <View
          className={cn(
            'size-[50px] rounded-full flex items-center justify-center',
            accentColorClass,
          )}>
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

      {/* Right Section: Total Price + Menu */}
      <View className="flex items-center justify-center gap-2">
        <Text variant="p" className="tracking-normal font-bold">
          {totalPrice}
        </Text>
      </View>
    </Pressable>
  );
};
