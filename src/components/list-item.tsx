import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from './ui/text';
import { Button } from './ui/button';
import { Icon } from './ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { IconSquareCheck, IconSquare, IconEdit, IconTrash } from '@tabler/icons-react-native';

interface ListItemProps {
  title: string;
  item: any;
  price: string;
  amount: string;
  status: boolean;
  background: string;
  checkColor: string;
  color: string;
  subColor: string;
  checkHandle: () => void;
  deleteHandle: (id: string) => void;
  editHandle: (item: any) => void;
  options?: any; // For compatibility with original code if needed
}

export default function ListItem({
  title,
  item,
  price,
  amount,
  status,
  background,
  checkColor,
  color,
  subColor,
  checkHandle,
  deleteHandle,
  editHandle,
}: ListItemProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Pressable
      onPress={checkHandle}
      onLongPress={() => setVisible(true)}
      className="mb-1 mt-1 flex-row items-center justify-between px-4 py-3"
      style={{
        backgroundColor: visible ? '#ffffff16' : undefined,
        height: 100,
      }}>
      {/* Left: Checkbox */}
      <View className="h-[100px] items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          onPress={checkHandle}
          style={{ opacity: !status ? 0.5 : 1 }}>
          <Icon
            as={status ? IconSquareCheck : IconSquare}
            size={35}
            style={{ color: status ? checkColor : background }}
          />
        </Button>
      </View>

      {/* Center: Title */}
      <View className="flex-1 justify-center px-3">
        <Text
          variant="large"
          className="text-lg font-bold"
          style={{
            color: color,
            textDecorationLine: status ? 'line-through' : 'none',
          }}>
          {title}
        </Text>
      </View>

      {/* Right: Price/Amount + Menu */}
      <View className="h-full items-end justify-center">
        <DropdownMenu onOpenChange={setVisible}>
          <DropdownMenuTrigger asChild>
            <Pressable className="h-full items-end justify-center">
              <Text className="text-base font-bold" style={{ color: subColor }}>
                {price}
              </Text>
              <Text className="text-sm font-bold" style={{ color: subColor }}>
                {amount} und
              </Text>
            </Pressable>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48">
            <DropdownMenuItem
              onPress={() => {
                setVisible(false);
                editHandle(item);
              }}>
              <Icon as={IconEdit} size={18} />
              <Text>Editar</Text>
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onPress={() => {
                setVisible(false);
                deleteHandle(item.id);
              }}>
              <Icon as={IconTrash} size={18} />
              <Text>Deletar</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>
    </Pressable>
  );
}
