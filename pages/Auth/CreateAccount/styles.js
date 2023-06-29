import { styled } from "styled-components/native";
import theme from "../../../assets/theme.json";
import { responsiveScreenHeight } from "react-native-responsive-dimensions";
import {
  ContainerLogin,
  LoginHeaderSection,
  LoginImage,
  LoginTitle,
} from "../styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const AccountScrollView = styled(KeyboardAwareScrollView)`
  width: 100%;
  height: 100%;

  background-color: ${theme.palettes.tertiary[95]};
`;

export const CreateAccountContainer = styled(ContainerLogin)`
  width: 100%;
  height: ${() => responsiveScreenHeight(98)}px;

  background-color: ${theme.palettes.tertiary[95]};
  transition: all 0.5s ease-in-out;
`;

export const CreateAccountImage = styled(LoginImage)`
  height: ${responsiveScreenHeight(30)}px;
`;

export const CreateAccountTitle = styled(LoginTitle)``;

export const CreateAccountHeader = styled(LoginHeaderSection)`
  height: ${responsiveScreenHeight(40)}px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const CreateAccountForm = styled.View`
  width: 100%;
  height: ${responsiveScreenHeight(50)}px;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;
