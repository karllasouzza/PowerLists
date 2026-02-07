import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Text } from './ui/text';
import { Icon } from './ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { IconCheck, IconEdit, IconTrash } from '@tabler/icons-react-native';
import { List } from '@/data/types';

interface CardListProps {
  list: List;
  pressHandler: () => void;
  deleteHandle: (id: string) => void;
  editHandle: (id: string, title: string, color: string, closeMenu: () => void) => void;
}

export const CardList = ({ list, pressHandler, deleteHandle, editHandle }: CardListProps) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const items = list.listItems || [];
  const boughtCount = items.filter((item: any) => item?.isChecked === true).length;
  const totalCount = items.length;

  const calculateTotal = () => {
    const prices = items.map((item: any) => item.price * item.amount);
    if (prices.length === 0) return 'R$ 0,00';
    const total = prices.reduce((accum: number, curr: number) => accum + curr, 0);
    return total.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <Pressable
      onPress={pressHandler}
      onLongPress={openMenu}
      className="flex-row items-center justify-between px-6 py-3"
      style={{
        backgroundColor: visible ? '#ffffff16' : undefined,
      }}>
      {/* Left Section: Avatar + Title/Description */}
      <View className="flex-1 flex-row items-center gap-3">
        <Avatar
          alt={list.title || 'Lista'}
          className="size-[50px]"
          style={{
            backgroundColor: list.accentColor || '#000',
          }}>
          <AvatarFallback>
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
          {calculateTotal()}
        </Text>

        <DropdownMenu onOpenChange={setVisible}>
          <DropdownMenuTrigger asChild>
            <Pressable className="p-2">
              <Icon as={IconEdit} size={20} />
            </Pressable>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48">
            <DropdownMenuItem
              onPress={() => {
                editHandle(list.id, list.title, list.accentColor || '#000', closeMenu);
                closeMenu();
              }}>
              <Icon as={IconEdit} size={18} />
              <Text>Editar</Text>
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onPress={() => {
                deleteHandle(list.id);
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
