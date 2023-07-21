import React from "react";
import CheckBox from "../../assets/svgs/CheckBox";
import {
  ItemAmount,
  ItemContainer,
  ItemPrice,
  ItemColumn,
  ItemTitle,
} from "./styles";

export default ({
  item,
  price,
  amount,
  status,
  background,
  checkColor,
  color,
  subColor,
}) => {
  return (
    <ItemContainer border={color}>
      <CheckBox
        width={35}
        background={background}
        check_color={checkColor}
        checked={status}
        next={() => {}}
        prev={() => {}}
      />
      <ItemTitle color={color}>{item}</ItemTitle>
      <ItemColumn>
        <ItemPrice color={subColor}>{price}</ItemPrice>
        <ItemAmount color={subColor}>{amount} und</ItemAmount>
      </ItemColumn>
    </ItemContainer>
  );
};
