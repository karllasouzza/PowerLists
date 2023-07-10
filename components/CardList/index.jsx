import React from "react";
import {
  CardListTitle,
  CardListContainer,
  CardListProgress,
  CardListLabels,
  CardListOptions,
  CardListPrice,
  CardListContainerBackground,
  CardListContainerAccentColor,
} from "./styles";

export const CardList = ({
  list: { title, List_item, background, accentColor, subColor, color },
  pressHandler,
}) => (
  <CardListContainer onPress={() => pressHandler()}>
    <CardListLabels>
      <CardListTitle color={color}>{title}</CardListTitle>
      <CardListProgress subColor={subColor}>
        {List_item?.filter((item) => item?.status === true).length}/
        {List_item?.length} compradas
      </CardListProgress>
    </CardListLabels>
    <CardListOptions>
      <CardListPrice subColor={subColor}>
        R${" "}
        {List_item?.map((item) => item.price).length
          ? List_item?.map((item) => item.price)?.reduce(
              (accum, curr) => accum + curr
            )
          : List_item?.map((item) => item.price).length}
      </CardListPrice>
    </CardListOptions>
    <CardListContainerBackground background={background} />
    <CardListContainerAccentColor accentColor={accentColor} />
  </CardListContainer>
);
