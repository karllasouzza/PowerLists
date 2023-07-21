import { styled } from "styled-components/native";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export const CardListContainer = styled.Pressable`
  width: 100%;
  height: 100px;
  margin-bottom: 16px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

export const CardListContainerBackground = styled.View`
  width: 100%;
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
  width: 15px;
  height: 100%;
  padding: 0;

  z-index: -1;
  opacity: 1;
  border-radius: 0;

  left: 0px;
  top: 0px;
  bottom: 0px;
  background-color: ${({ accentColor }) => accentColor};
`;

export const CardListTitle = styled.Text`
  font-size: ${responsiveFontSize(2.3)}px;
  font-weight: bold;
  color: ${({ color }) => color};

  margin-bottom: 15px;
`;

export const CardListProgress = styled.Text`
  font-size: ${responsiveFontSize(1.8)}px;
  font-weight: bold;
  color: ${({ subColor }) => subColor};
`;

export const CardListPrice = styled.Text`
  font-size: ${responsiveFontSize(2)}px;
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
