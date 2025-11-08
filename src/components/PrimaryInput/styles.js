import { styled } from "styled-components/native";
import { TextInput } from "react-native-paper";

export const Input = styled(TextInput)`
  color: ${({ color }) => color};
`;
