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
export const LoginHeader = styled(CreateAccountHeader)`
  max-height: 300px;
`;

export const LoginImage = styled(CreateAccountImage)`
  height: 200px;
`;
export const LoginTitle = styled(Text)`
  font-weight: 700;
  color: ${({ color }) => color};
`;
export const LoginForm = styled(CreateAccountForm)``;
