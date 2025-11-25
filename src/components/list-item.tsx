import React, { useState } from 'react';
import { View } from 'react-native';
import { IconButton, List, Menu, Text } from 'react-native-paper';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

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
    <List.Item
      onLongPress={() => setVisible(true)}
      onPress={checkHandle}
      style={{
        backgroundColor: visible ? '#ffffff16' : undefined,
        width: '100%',
        height: 100,
        marginBottom: 5,
        marginTop: 5,
        paddingHorizontal: 15,
        justifyContent: 'center',
      }}
      title={title}
      titleStyle={{
        fontSize: responsiveFontSize(2.3),
        fontWeight: 'bold',
        color: color,
        textDecorationLine: status ? 'line-through' : 'none',
      }}
      descriptionStyle={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
      left={() => (
        <View className="h-[100px] items-center justify-center">
          <IconButton
            size={35}
            style={{ opacity: !status ? 0.5 : 1 }}
            icon={status ? 'check' : 'checkbox-blank'}
            iconColor={status ? checkColor : background}
            onPress={checkHandle}
          />
        </View>
      )}
      right={() => (
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <View className="h-full items-start justify-center">
              <Text
                style={{ color: subColor, fontWeight: 'bold', fontSize: responsiveFontSize(2) }}>
                {price}
              </Text>
              <Text
                style={{ color: subColor, fontWeight: 'bold', fontSize: responsiveFontSize(1.8) }}>
                {amount} und
              </Text>
            </View>
          }>
          <Menu.Item
            onPress={() => {
              setVisible(false);
              editHandle(item);
            }}
            leadingIcon="file-document-edit-outline"
            title="Editar"
          />
          <Menu.Item
            onPress={() => {
              setVisible(false);
              deleteHandle(item.id);
            }}
            leadingIcon="trash-can-outline"
            title="Deletar"
          />
        </Menu>
      )}
    />
  );
}
