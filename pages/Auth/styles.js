import { styled } from "styled-components/native";
import theme from "../../assets/theme.json";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

export const ContainerLogin = styled.View`
  width: 100%;
  height: 100%;
  padding: 0%;
  margin: 0;
  padding-top: ${responsiveHeight(5)}px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.palettes.primary[90]};
  transition: all 0.5s ease-in-out;
`;

export const LoginImage = styled.Image`
  height: ${() => responsiveHeight(40)}px;
  object-fit: contain;
`;

export const AccountContainer = styled.View`
  width: 100%;
  height: ${() => responsiveHeight(25)}px;
  background-color: ${theme.palettes.secondary[80]};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: ${responsiveHeight(3)}px;
  border-radius: 20px 20px 0 0;
`;

export const LoginHeaderSection = styled.View`
  width: 100%;
  height: ${() => responsiveScreenHeight(65)}px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const LoginTitle = styled.Text`
  color: ${theme.coreColors.white};
  font-size: ${() => responsiveFontSize(3.5)}px;
  font-weight: bold;
`;
