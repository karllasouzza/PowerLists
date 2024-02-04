import React, { useState } from "react";
import { ItemAmount, ItemContainer, ItemPrice, ItemColumn } from "./styles";
import { List, Menu } from "react-native-paper";
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
    iconTitle: {
      fontSize: responsiveFontSize(2.3),
      fontWeight: "bold",
      color: color,
    },
    iconContent: {
      height: 100,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
    },
  });

  return (
    <ItemContainer
      onLongPress={() => setVisible(true)}
      onPress={() => checkHandle(item.id, status)}
      style={{ backgroundColor: visible ? "#ffffff16" : null }}
      title={title}
      titleStyle={styles.iconTitle}
      contentStyle={styles.iconContent}
      left={() => (
        <List.Icon
          color={status ? checkColor : background}
          icon={status ? "check" : "checkbox-blank"}
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
          }>
          <Menu.Item
            onPress={() => editHandle(id, title, accentColor)}
            leadingIcon='file-document-edit-outline'
            title='Editar'
          />
          <Menu.Item
            onPress={() => deleteHandle(item.id)}
            leadingIcon='trash-can-outline'
            title='Deletar'
          />
        </Menu>
      )}
    />

    // <ItemContainer border={color} onLongPress={() => setLongPress(true)}>

    //   <ItemTitle color={color} status={status}>
    //     {title}
    //   </ItemTitle>

    //   {longPress ? (
    //     <CardListOptions background={options.background}>
    //       <IconContainer
    //         background={options.deleteBackground}
    //         onPress={() => deleteHandle(item.id)}>
    //         <TrashIcon background={options.deleteColor} />
    //       </IconContainer>
    //       <IconContainer
    //         background={options.editBackground}
    //         onPress={() => editHandle(item)}>
    //         <EditIcon background={options.editColor} width={20} />
    //       </IconContainer>
    //     </CardListOptions>
    //   ) : null}
    //   {longPress ? (
    //     <BlurPopUp
    //       zIndex={1}
    //       background={options.shadow}
    //       closeHandle={() => setLongPress(false)}
    //     />
    //   ) : null}
    // </ItemContainer>
  );
};
