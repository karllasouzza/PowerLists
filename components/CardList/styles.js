import { styled } from "styled-components/native";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export const CardListContainer = styled.Pressable`
  width: 100%;
  height: 100px;
  padding: 20px 15px;
  border-radius: 20px;
  margin-bottom: 16px;

  flex-direction: row;
  justify-content: space-between;
`;

export const CardListContainerBackground = styled.View`
  width: 105%;
  height: 100px;
  padding: 15px;
  border-radius: 20px;

  position: absolute;
  z-index: -1;

  right: 0;
  top: 0;
  bottom: 0;

  background-color: ${({ background }) => background};
  opacity: 0.4000000059604645;
`;

export const CardListContainerAccentColor = styled(CardListContainerBackground)`
  width: 20px;

  z-index: -2;
  background-color: ${({ accentColor }) => accentColor};
  opacity: 1;

  left: 0;
  top: 0;
  bottom: 0;
`;

export const CardListTitle = styled.Text`
  font-size: ${responsiveFontSize(2.7)}px;
  font-weight: bold;
  color: ${({ color }) => color};

  margin-left: 30px;
`;

export const CardListProgress = styled.Text`
  font-size: ${responsiveFontSize(2)}px;
  font-weight: bold;
  color: ${({ subColor }) => subColor};

  margin-left: 30px;
`;

export const CardListPrice = styled.Text`
  font-size: ${responsiveFontSize(2.5)}px;
  font-weight: bold;
  color: ${({ subColor }) => subColor};
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
