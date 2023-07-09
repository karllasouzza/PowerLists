import { styled } from "styled-components/native";
import theme from "../../assets/theme.json";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export const CardListContainer = styled.Pressable`
  width: 90%;
  height: 100px;
  padding: 15px;
  border-radius: 10px;

  flex-direction: row;
  justify-content: space-between;

  background-color: ${theme.palettes.primary[90]};
`;

export const CardListTitle = styled.Text`
  font-size: ${responsiveFontSize(2.7)}px;
  font-weight: bold;
  color: ${theme.palettes.neutral[0]};
`;

export const CardListProgress = styled.Text`
  font-size: ${responsiveFontSize(2)}px;
  font-weight: bold;
  color: ${theme.palettes.neutral[20]};
`;

export const CardListPrice = styled.Text`
  font-size: ${responsiveFontSize(2.5)}px;
  font-weight: bold;
  color: ${theme.palettes.neutral[20]};
`;

export const CardListLabels = styled.View`
  flex-direction: column;
  justify-content: space-between;
`;

export const CardListOptions = styled.View`
  width: 100px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
