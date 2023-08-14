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
import TrashIcon from "../../assets/svgs/TrashIcon";
import EditIcon from "../../assets/svgs/EditIcon";
import theme from "../../assets/theme.json";
import BlurPopUp from "../BlurPopUp";
import { List } from "react-native-paper";

export const CardList = ({
  list: { id, title, List_item, subColor, color, accentColor },
  pressHandler,
  deleteHandle,
  editHandle,
}) => {
  const [longPress, setLongPress] = useState(false);

  return (
    <List.Item
      title={title}
      description={`${
        List_item?.filter((item) => item?.status === true).length
      }/${List_item?.length} compradas`}
      onPress={pressHandler}
      // onLongPress={() => setLongPress(true)}
      left={(props) => <List.Icon {...props} icon='cart' />}
      right={() => (
        <CardListPrice subColor={subColor}>
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
        </CardListPrice>
      )}>
      {/* <CardListLabels> */}
      {/* <CardListProgress subColor={subColor}>
          {List_item?.filter((item) => item?.status === true).length}/
          {List_item?.length} compradas
        </CardListProgress>
      </CardListLabels>
 */}
      {/* {longPress ? (
        <CardListOptions background={accentColor.value}>
          <IconContainer
            background={theme.palettes.error[90]}
            onPress={() => deleteHandle(id, setLongPress)}>
            <TrashIcon background={theme.coreColors.error} />
          </IconContainer>
          <IconContainer
            background={theme.palettes.tertiary[90]}
            onPress={() => editHandle(id, title, accentColor.name)}>
            <EditIcon background={theme.coreColors.tertiary} width={20} />
          </IconContainer>
        </CardListOptions>
      ) : null}
      {longPress ? (
        <BlurPopUp
          zIndex={1}
          background={theme.coreColors.black}
          closeHandle={() => setLongPress(false)}
        />
      ) : null} */}
    </List.Item>
  );
};
