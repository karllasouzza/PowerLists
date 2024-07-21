import { styled } from "styled-components/native";
import { responsiveScreenHeight } from "react-native-responsive-dimensions";
import {
  AuthHeaderSection,
  AuthImage,
  AuthTitle,
  ContainerAuth,
} from "../styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Text } from "react-native-paper";

export const AccountScrollView = styled(KeyboardAwareScrollView)`
  width: 100%;
  height: 100%;

  background-color: ${({ background }) => background};
  margin-top: 0;
  padding-top: 0;
`;

export const CreateAccountContainer = styled(ContainerAuth)`
  width: 100%;
  height: ${() => responsiveScreenHeight(95)}px;

  background-color: ${({ background }) => background};
  transition: all 0.5s ease-in-out;

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;

  margin-top: 0;
  padding-top: 0;
`;

export const CreateAccountImage = styled(AuthImage)``;

export const CreateAccountTitle = styled(AuthTitle)`
  width: 100%;
  color: ${({ color }) => color};
`;

export const CreateAccountHeader = styled(AuthHeaderSection)`
  width: 80%;
  flex-grow: 1;
  gap: 18px;
`;

export const CreateAccountForm = styled.View`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;

  flex-grow: 1;
`;

export const IHaveAccount = styled.View`
  flex-grow: 0.3;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const ChangeFormTipe = styled(Text)``;

export const ButtonNavigate = styled(Button)`
  color: ${({ color }) => color};
`;
