import { styled } from "styled-components/native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import {
  Header,
  HeaderTitle,
  SafeContentEdge,
} from "../styles";
import { ScrollView } from "react-native";

export const ListContainer = styled(SafeContentEdge)`
  padding: 0;
  background-color: ${({ background }) => background};

  width: 100%;
  height: 100%;
`;

export const ListHeader = styled(Header)`
  width: 100%;
  height: 100px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background-color: ${({ background }) => background};
  margin: 0;
`;

export const IconContainer = styled.Pressable`
  width: 55px;
  height: 55px;
  border-radius: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ background }) => background};
`;

export const ItemsColumn = styled.View`
  width: 50%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

export const ListHeaderTitle = styled(HeaderTitle)`
  font-size: ${responsiveFontSize(2.3)}px;
  color: ${({ color }) => color};
`;

export const ListHeaderSubtitle = styled(ListHeaderTitle)`
  font-size: ${responsiveFontSize(2)}px;
  color: ${({ color }) => color};
`;

export const ListItemsContainer = styled(ScrollView)`
  width: 100%;
  height: 100%;

  overflow: scroll;
`;
