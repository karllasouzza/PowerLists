import { styled } from "styled-components";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import {
  Header,
  HeaderTitle,
  ListsContainer,
  SafeContentEdge,
} from "../Home/styles";

export const ListContainer = styled(SafeContentEdge)`
  background-color: ${({ background }) => background};
`;

export const ListHeader = styled(Header)``;

export const ListHeaderTitle = styled(HeaderTitle)`
  color: ${({ color }) => color};
`;

export const ListHeaderSubtitle = styled(ListHeaderTitle)`
  font-size: ${responsiveFontSize(2.5)}px;
  color: ${({ color }) => color};
`;

export const ListItemsContainer = styled(ListsContainer)``;
