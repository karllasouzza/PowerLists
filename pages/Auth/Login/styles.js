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
import { Text } from "react-native-paper";

export const LoginScrollView = styled(KeyboardAwareScrollView)`
  width: 100%;
  height: 100%;
  background-color: ${({ background }) => background};

  padding-top: 20px;
`;
export const LoginContainer = styled(CreateAccountContainer)`
  background-color: ${({ background }) => background};
`;
export const LoginHeader = styled(CreateAccountHeader)``;

export const LoginTitle = styled(CreateAccountTitle)``;
export const LoginForm = styled(CreateAccountForm)`
  flex-grow: 1;
  gap: 50px;
  padding-bottom: 40px;
`;
