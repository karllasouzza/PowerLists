import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import { styled } from "styled-components/native";

export const ButtonTouch = styled.Pressable`
  width: ${() => responsiveWidth(20)}%;
  height: 50px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonBackground = styled.View`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: ${({ background }) => background};
  border-radius: 20px;
  opacity: 0.4000000059604645;
  z-index: -1;
`;

export const ButtonText = styled.Text`
  color: ${({ color }) => color};
  font-size: ${() => responsiveFontSize(2)}px;
  font-weight: bold;
  letter-spacing: 1px;
  text-align: center;
  text-transform: uppercase;
`;
