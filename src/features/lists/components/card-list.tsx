import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { IconCheck, IconEdit, IconTrash } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';

import { List } from '@/data/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { calculateTotal } from '@/features/list_items';

interface CardListProps {
  list: List;
}

export const CardList = ({ list }: CardListProps) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const handleRouterPush = () => {
    console.log('Navigating to list with ID:', list.id);
    router.push({
      pathname: 'lists/[id]',
      params: { id: list.id },
    });
  };

  const items = list.listItems || [];
  const boughtCount = items.filter((item: any) => item?.isChecked === true).length;
  const totalCount = items.length;

  const totalPrice = calculateTotal(items);

  return (
    <Pressable
      onPress={handleRouterPush}
      onLongPress={openMenu}
      className={cn('flex-row items-center justify-between px-4 py-3', visible && 'bg-primary/10')}>
      {/* Left Section: Avatar + Title/Description */}
      <View className="flex-1 flex-row items-center gap-3">
        <Avatar
          alt={list.title || 'Lista'}
          className={cn('size-[50px]', list.accentColor ? `bg-${list.accentColor}` : 'bg-primary')}>
          <AvatarFallback className="bg-transparent">
            {visible ? (
              <Icon as={IconCheck} size={24} className="text-white" />
            ) : (
              <Text className="text-lg font-bold text-white">
                {list.title?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            )}
          </AvatarFallback>
        </Avatar>

        <View className="flex-1">
          <Text variant="large" className="font-bold">
            {list.title}
          </Text>
          <Text variant="muted" className="text-sm">
            {boughtCount}/{totalCount} compradas
          </Text>
        </View>
      </View>

      {/* Right Section: Total Price + Menu */}
      <View className="flex-row items-center gap-2">
        <Text variant="large" className="font-bold">
          {totalPrice}
        </Text>

        <DropdownMenu onOpenChange={setVisible}>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem
              onPress={() => {
                // editHandle(list.id, list.title, list.accentColor || '#000', closeMenu);
                closeMenu();
              }}>
              <Icon as={IconEdit} size={18} />
              <Text>Editar</Text>
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onPress={() => {
                // deleteHandle(list.id);
                closeMenu();
              }}>
              <Icon as={IconTrash} size={18} />
              <Text>Deletar</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>
    </Pressable>
  );
};
