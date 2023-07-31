import React, { useState } from "react";
import CheckBox from "../../assets/svgs/CheckBox";
import {
  ItemAmount,
  ItemContainer,
  ItemPrice,
  ItemColumn,
  ItemTitle,
} from "./styles";
import { CardListOptions, IconContainer } from "../CardList/styles";
import TrashIcon from "../../assets/svgs/TrashIcon";
import EditIcon from "../../assets/svgs/EditIcon";
import BlurPopUp from "../BlurPopUp";

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
  options,
  deleteHandle,
  editHandle,
}) => {
  const [longPress, setLongPress] = useState(false);

  return (
    <ItemContainer border={color} onLongPress={() => setLongPress(true)}>
      <CheckBox
        width={35}
        background={background}
        check_color={checkColor}
        checked={status}
        next={checkHandle}
        prev={checkHandle}
      />
      <ItemTitle color={color} status={status}>
        {title}
      </ItemTitle>
      <ItemColumn>
        <ItemPrice color={subColor}>{price}</ItemPrice>
        <ItemAmount color={subColor}>{amount} und</ItemAmount>
      </ItemColumn>

      {longPress ? (
        <CardListOptions background={options.background}>
          <IconContainer
            background={options.deleteBackground}
            onPress={() => deleteHandle(item.id)}>
            <TrashIcon background={options.deleteColor} />
          </IconContainer>
          <IconContainer
            background={options.editBackground}
            onPress={() => editHandle(item)}>
            <EditIcon background={options.editColor} width={20} />
          </IconContainer>
        </CardListOptions>
      ) : null}
      {longPress ? (
        <BlurPopUp
          zIndex={1}
          background={options.shadow}
          closeHandle={() => setLongPress(false)}
        />
      ) : null}
    </ItemContainer>
  );
};
