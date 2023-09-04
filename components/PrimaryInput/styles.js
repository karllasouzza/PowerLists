import { styled } from "styled-components/native";
import { TextInput } from "react-native-paper";

export const Input = styled(TextInput)`
  width: 80%;

  color: ${({ color }) => color};
`;
