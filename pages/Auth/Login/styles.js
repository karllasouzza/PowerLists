import { styled } from "styled-components/native";
import {
  CreateAccountContainer,
  CreateAccountForm,
  CreateAccountHeader,
  CreateAccountTitle,
} from "../CreateAccount/styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const LoginScrollView = styled(KeyboardAwareScrollView)`
  width: 100%;
  height: 100%;
  background-color: ${({ background }) => background};
  padding-top: 0;
`;
export const LoginContainer = styled(CreateAccountContainer)`
  padding-top: 0;
  background-color: ${({ background }) => background};
`;
export const LoginHeader = styled(CreateAccountHeader)``;

export const LoginTitle = styled(CreateAccountTitle)``;
export const LoginForm = styled(CreateAccountForm)`
  flex-grow: 1;
  gap: 50px;
`;
