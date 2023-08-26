import React, { useState } from "react";
import {
  CardListTitle,
  CardListContainer,
  CardListProgress,
  CardListLabels,
  CardListOptions,
  CardListPrice,
  IconContainer,
} from "./styles";
import { List, Text, Avatar, Menu, Button, Divider } from "react-native-paper";
import { Background } from "@react-navigation/elements";

export const CardList = ({
  list: { id, title, List_item, color, accentColor, iconBackground },
  pressHandler,
  deleteHandle,
  editHandle,
}) => {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <List.Item
      left={(props) => (
        <Avatar.Icon
          {...props}
          style={{ backgroundColor: color }}
          color={iconBackground}
          icon={visible ? "check-bold" : "cart"}
          size={50}
        />
      )}
      title={title}
      titleStyle={{ fontWeight: "bold" }}
      description={`${
        List_item?.filter((item) => item?.status === true).length
      }/${List_item?.length} compradas`}
      style={{
        paddingHorizontal: 25,
        backgroundColor: visible ? "#ffffff16" : null,
      }}
      onPress={pressHandler}
      onLongPress={() => openMenu()}
      right={() => (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Text
              variant='titleMedium'
              style={{
                fontSize: 16,
                marginVertical: 6,
                fontWeight: "bold",
              }}>
              {List_item?.map((item) => item.price).length
                ? List_item?.map((item) => item.price * item.amount)
                    ?.reduce((accum, curr) => accum + curr)
                    .toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })
                : List_item?.map((item) => item.price).length.toLocaleString(
                    "pt-br",
                    {
                      style: "currency",
                      currency: "BRL",
                    }
                  )}
            </Text>
          }>
          <Menu.Item
            onPress={() => editHandle(id, title, accentColor)}
            leadingIcon='file-document-edit-outline'
            title='Editar'
          />
          <Menu.Item
            onPress={() => deleteHandle(id)}
            leadingIcon='trash-can-outline'
            title='Deletar'
          />
        </Menu>
      )}
    />
    //       {/* {longPress ? (
    //         <CardListOptions background={accentColor.value}>
    //           <IconContainer
    //             background={theme.palettes.error[90]}
    //             onPress={() => }>
    //             <TrashIcon background={theme.coreColors.error} />
    //           </IconContainer>
    //           <IconContainer
    //             background={theme.palettes.tertiary[90]}
    //             onPress={() => >
    //             <EditIcon background={theme.coreColors.tertiary} width={20} />
    //           </IconContainer>
    //         </CardListOptions>
    //       ) : null}
    //       {longPress ? (
    //         <BlurPopUp
    //           zIndex={1}
    //           background={theme.coreColors.black}
    //           closeHandle={() => setLongPress(false)}
    //         />
    //       ) : null} */}
    //     {/* </List.Item> */}
  );
};
