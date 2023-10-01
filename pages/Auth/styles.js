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
  height: 200px;
  object-fit: contain;

  flex-grow: 0.2;
`;

export const AccountContainer = styled.View`
  width: 100%;
  background-color: ${({ background }) => background};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  flex-grow: 0.5;
  padding-bottom: 25px;
  gap: 50px;
  border-radius: 20px 20px 0 0;
`;

export const AuthHeaderSection = styled.View`
  width: 100%;

  max-height: 400px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 30px;

  flex-grow: 0.8;
`;

export const AuthTitle = styled(Text)`
  color: ${({ color }) => color};

  font-weight: 700;
  text-transform: capitalize;
`;
