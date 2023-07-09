import React from "react";
import { styled } from "styled-components/native";
import theme from "../../assets/theme.json";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";

export const SafeContentEdge = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  background-color: ${({ background }) => background};
`;

export const Header = styled.View`
  width: 100%;
  height: 70px;
  margin-bottom: 20px;
  padding: 0 25px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  font-size: ${responsiveFontSize(3)}px;
  font-weight: bold;
  color: ${theme.coreColors.black};
`;

export const UserName = styled(HeaderTitle)`
  color: ${theme.palettes.primary[30]};
  text-transform: capitalize;
`;

export const Add = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background-color: ${theme.palettes.primary[80]};
  justify-content: center;
  align-items: center;
`;

export const ListsContainer = styled.View`
  width: 100%;
  height: ${responsiveHeight(7)}%;
  padding: 10px 0;

  display: flex;
  align-items: center;
  gap: 16px;

  overflow-y: auto;
`;

export const Footer = styled(Header)``;
