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

export const CardList = ({
  list: { id, title, List_item, subColor, color, accentColor },
  pressHandler,
  deleteHandle,
  editHandle,
}) => {
  const [longPress, setLongPress] = useState(false);
  return (
    <CardListContainer
      onPress={pressHandler}
      onLongPress={() => setLongPress(true)}>
      <CardListLabels>
        <CardListTitle color={color}>{title}</CardListTitle>
        <CardListProgress subColor={subColor}>
          {List_item?.filter((item) => item?.status === true).length}/
          {List_item?.length} compradas
        </CardListProgress>
      </CardListLabels>
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
      {longPress ? (
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
      ) : null}
    </CardListContainer>
  );
};
