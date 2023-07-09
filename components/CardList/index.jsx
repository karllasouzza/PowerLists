import React from "react";
import {
  CardListTitle,
  CardListContainer,
  CardListProgress,
  CardListLabels,
  CardListOptions,
  CardListPrice,
} from "./styles";

export const CardList = ({ list: { title, current, total, totalPrice } }) => (
  <CardListContainer>
    <CardListLabels>
      <CardListTitle>{title}</CardListTitle>
      <CardListProgress>
        {current}/{total} concluído
      </CardListProgress>
    </CardListLabels>
    <CardListOptions>
      <CardListPrice>R$ {totalPrice}</CardListPrice>
    </CardListOptions>
  </CardListContainer>
);
