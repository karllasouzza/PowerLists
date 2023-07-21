import { styled } from "styled-components/native";
import {
  CardListPrice,
  CardListProgress,
  CardListTitle,
} from "../CardList/styles";

export const ItemContainer = styled.View`
  width: 100%;
  height: 100px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ItemColumn = styled.View`
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const ItemTitle = styled(CardListTitle)`
  width: 40%;

  margin-bottom: 0;
  color: ${({ color }) => color};
`;
export const ItemAmount = styled(CardListProgress)`
  color: ${({ color }) => color};
`;
export const ItemPrice = styled(CardListPrice)`
  color: ${({ color }) => color};
`;
