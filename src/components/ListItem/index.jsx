import React, { useState } from "react";
import { ItemAmount, ItemContainer, ItemPrice, ItemColumn } from "./styles";
import { IconButton, Menu } from "react-native-paper";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { StyleSheet } from "react-native";

export default ({
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
}) => {
  const [visible, setVisible] = useState(false);

  const styles = StyleSheet.create({
    itemTitle: {
      fontSize: responsiveFontSize(2.3),
      fontWeight: "bold",
      color: color,
    },
    itemContent: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingRight: 15,
    },
    itemIcon: {
      height: 100,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <ItemContainer
      onLongPress={() => setVisible(true)}
      onPress={checkHandle}
      style={{ backgroundColor: visible ? "#ffffff16" : null }}
      title={title}
      titleStyle={styles.itemTitle}
      contentStyle={styles.itemContent}
      left={() => (
        <IconButton
          size={35}
          style={{ ...styles.itemIcon, opacity: !status ? 0.5 : 1 }}
          icon={status ? "check" : "checkbox-blank"}
          iconColor={status ? checkColor : background}
        />
      )}
      right={() => (
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <ItemColumn>
              <ItemPrice color={subColor}>{price}</ItemPrice>
              <ItemAmount color={subColor}>{amount} und</ItemAmount>
            </ItemColumn>
          }
        >
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
};
