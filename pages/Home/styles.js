import { styled } from "styled-components/native";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import { List, MD3Colors } from "react-native-paper";

export const SafeContentEdge = styled.View`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ background }) => background};
`;

export const Header = styled.View`
  width: 100%;
  height: 70px;
  margin: 0;
  padding: 0 25px;
  margin-top: 8px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background-color: ${({ background }) => background};
`;

export const HeaderTitle = styled.Text`
  height: auto;

  font-size: ${responsiveFontSize(2.7)}px;
  color: ${({ color }) => color};

  font-weight: bold;
`;

export const Add = styled.TouchableOpacity`
  width: 50px;
  height: 50px;

  justify-content: center;
  align-items: center;

  background-color: ${({ background }) => background};
  border-radius: 30px;
`;

export const ListsContainer = styled(List.Section)`
  width: 100%;
  padding: 10px 0;
`;
