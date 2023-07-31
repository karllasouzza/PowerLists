import { styled } from "styled-components/native";
import {
  CreateAccountContainer,
  CreateAccountForm,
  CreateAccountHeader,
  CreateAccountImage,
  CreateAccountTitle,
} from "../CreateAccount/styles";
import { responsiveScreenHeight } from "react-native-responsive-dimensions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const LoginScrollView = styled(KeyboardAwareScrollView)`
  width: 100%;
  height: 100%;
  background-color: ${({ background }) => background};
`;
export const LoginContainer = styled(CreateAccountContainer)`
  background-color: ${({ background }) => background};
`;
export const LoginHeader = styled(CreateAccountHeader)``;

export const LoginImage = styled(CreateAccountImage)`
  height: ${responsiveScreenHeight(30)}px;
`;
export const LoginTitle = styled(CreateAccountTitle)`
  color: ${({ color }) => color};
`;
export const LoginForm = styled(CreateAccountForm)``;
