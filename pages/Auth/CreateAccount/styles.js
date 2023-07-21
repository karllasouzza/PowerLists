import { styled } from "styled-components/native";
import { responsiveScreenHeight } from "react-native-responsive-dimensions";
import {
  AuthHeaderSection,
  AuthImage,
  AuthTitle,
  ContainerAuth,
} from "../styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const AccountScrollView = styled(KeyboardAwareScrollView)`
  width: 100%;
  height: 100%;

  background-color: ${({ background }) => background};
`;

export const CreateAccountContainer = styled(ContainerAuth)`
  width: 100%;
  height: ${() => responsiveScreenHeight(98)}px;

  background-color: ${({ background }) => background};
  transition: all 0.5s ease-in-out;
`;

export const CreateAccountImage = styled(AuthImage)`
  height: ${responsiveScreenHeight(30)}px;
`;

export const CreateAccountTitle = styled(AuthTitle)`
  color: ${({ color }) => color};
`;

export const CreateAccountHeader = styled(AuthHeaderSection)`
  height: ${responsiveScreenHeight(30)}px;
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
