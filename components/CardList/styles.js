import { styled } from "styled-components/native";
import theme from "../../assets/theme.json";

export const CardListContainer = styled.Pressable`
  width: 90%;
  height: 70px;
  padding: 10px;
  border-radius: 10px;

  flex-direction: row;
  justify-content: space-between;

  background-color: ${theme.palettes.primary[60]};
`;

export const CardListTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.palettes.neutral[100]};
`;

export const CardListProgress = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${theme.palettes.neutral[90]};
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
