import { styled } from "styled-components/native";
import { Text } from "react-native-paper";

export const ContainerAuth = styled.View`
  width: 100%;
  height: 100%;
  padding: 0%;
  margin: 0;
  padding-top: 25px;

  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ background }) => background};
  transition: all 0.5s ease-in-out;
`;

export const AuthImage = styled.Image`
  height: 300px;
  object-fit: contain;
`;

export const AccountContainer = styled.View`
  width: 100%;
  background-color: ${({ background }) => background};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-grow: 0.5;

  padding-top: 25px;
  border-radius: 20px 20px 0 0;
`;

export const AuthHeaderSection = styled.View`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  flex-grow: 0.8;

  padding-bottom: 25px;
`;

export const AuthTitle = styled(Text)`
  color: ${({ color }) => color};

  font-weight: 700;
  text-transform: capitalize;
`;
