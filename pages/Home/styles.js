import React from "react";
import { styled } from "styled-components/native";
import theme from "../../assets/theme.json";

export const SafeContentEdge = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: ${(props) => props.top}px;
  padding-bottom: ${(props) => props.bottom}px;
  padding-left: ${(props) => props.left}px;
  padding-right: ${(props) => props.right}px;
  background-color: ${theme.palettes.neutral[99]};
`;

export const Header = styled.View`
  width: 90%;
  height: 45px;
  margin-bottom: 20px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const UserSalutation = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.palettes.primary[30]};
`;

export const Add = styled.TouchableOpacity`
  width: 45px;
  height: 45px;
  border-radius: 10px;
  background-color: ${theme.palettes.primary[80]};
  justify-content: center;
  align-items: center;
`;
