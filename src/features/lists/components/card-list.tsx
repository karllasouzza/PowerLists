import React from 'react';
import { Pressable, View } from 'react-native';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  const items = list.listItems || [];
  const boughtCount = items.filter((item: any) => item?.isChecked === true).length;
  const totalCount = items.length;
  const cardIcon = CardIcons[list.icon as keyof typeof CardIcons] || IconShoppingCart;
  const totalPrice = calculateTotal(items);

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

      {/* Right Section: Total Price + Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Pressable className="items-end justify-center">
            <Text variant="p" className="tracking-normal font-bold">
              {totalPrice}
            </Text>
          </Pressable>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48">
          <DropdownMenuItem onPress={() => onEdit(list.id)}>
            <Icon as={IconEdit} size={18} />
            <Text>Editar</Text>
          </DropdownMenuItem>

          <DropdownMenuItem variant="destructive" onPress={() => onDelete(list.id)}>
            <Icon as={IconTrash} size={18} />
            <Text>Deletar</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Pressable>
  );
};
