import { styled } from "styled-components/native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
} from "react-native-responsive-dimensions";

export const ContainerAuth = styled.View`
  width: 100%;
  height: 100%;
  padding: 0%;
  margin: 0;
  padding-top: ${responsiveHeight(5)}px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ background }) => background};
  transition: all 0.5s ease-in-out;
`;

export const AuthImage = styled.Image`
  height: ${() => responsiveHeight(40)}px;
  object-fit: contain;
`;

export const AccountContainer = styled.View`
  width: 100%;
  height: ${() => responsiveHeight(25)}px;
  background-color: ${({ background }) => background};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: ${responsiveHeight(3)}px;
  border-radius: 20px 20px 0 0;
`;

export const AuthHeaderSection = styled.View`
  width: 100%;
  height: ${() => responsiveScreenHeight(65)}px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const AuthTitle = styled.Text`
  color: ${({ color }) => color};
  font-size: ${() => responsiveFontSize(3.5)}px;

  font-family: sans-serif;
  font-style: normal;
  font-weight: 700;
  text-transform: capitalize;
`;
