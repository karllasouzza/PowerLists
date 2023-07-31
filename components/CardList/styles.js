import { styled } from "styled-components/native";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export const CardListContainer = styled.Pressable`
  width: 100%;
  height: 100px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: 0 20px;
  margin-bottom: 5px;
  margin-top: 5px;

  border-radius: 20px;
  overflow: hidden;
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

  width: 100px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const CardListLabels = styled.View`
  flex-direction: column;
  justify-content: space-between;
`;

export const CardListOptions = styled.View`
  width: 140px;
  height: 100%;

  background-color: ${({ background }) => background};
  border-radius: 20px 0 0 20px;

  flex-direction: row;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 2;

  gap: 10px;
`;

export const IconContainer = styled.Pressable`
  width: 50px;
  height: 50px;
  border-radius: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ background }) => background};
`;
