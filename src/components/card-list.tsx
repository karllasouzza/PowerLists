import React, { useState } from 'react';
import { List, Text, Avatar, Menu } from 'react-native-paper';
import { View } from 'react-native';
import { ListType } from '../data/types/list.type'; // Adjust import path as needed
import { ItemType } from '../data/types/list-item.type'; // Adjust import path as needed

// Define props interface
interface CardListProps {
  list: any; // TODO: Use proper ListType from unified types, but need to handle the extended properties like color, background etc.
  pressHandler: () => void;
  deleteHandle: (id: string) => void;
  editHandle: (id: string, title: string, color: string, closeMenu: () => void) => void;
}

export const CardList = ({ list, pressHandler, deleteHandle, editHandle }: CardListProps) => {
  const { id, title, List_item, color, accentColor, iconBackground, icon } = list;
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const items = List_item || [];
  const boughtCount = items.filter((item: any) => item?.status === true).length;
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
    <List.Item
      left={(props) => (
        <Avatar.Icon
          {...props}
          style={{ backgroundColor: color }}
          color={iconBackground}
          icon={visible ? 'check-bold' : icon}
          size={50}
        />
      )}
      title={title}
      titleStyle={{ fontWeight: 'bold' }}
      description={`${boughtCount}/${totalCount} compradas`}
      style={{
        paddingHorizontal: 25,
        backgroundColor: visible ? '#ffffff16' : undefined,
      }}
      onPress={pressHandler}
      onLongPress={openMenu}
      right={() => (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Text
              variant="titleMedium"
              style={{
                fontSize: 16,
                marginVertical: 6,
                fontWeight: 'bold',
              }}>
              {calculateTotal()}
            </Text>
          }>
          <Menu.Item
            onPress={() => editHandle(id, title, accentColor.name, closeMenu)}
            leadingIcon="file-document-edit-outline"
            title="Editar"
          />
          <Menu.Item
            onPress={() => deleteHandle(id)}
            leadingIcon="trash-can-outline"
            title="Deletar"
          />
        </Menu>
      )}
    />
  );
};
