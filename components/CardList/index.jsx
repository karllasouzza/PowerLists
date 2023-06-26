import React from "react";
import {
  CardListTitle,
  CardListContainer,
  CardListProgress,
  CardListLabels,
  CardListOptions,
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
      <CardListProgress>R${totalPrice}</CardListProgress>
    </CardListOptions>
  </CardListContainer>
);
