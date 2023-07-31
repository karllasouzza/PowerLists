import { styled } from "styled-components/native";
import theme from "../../../assets/theme.json";

export const Color = styled.Pressable`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;

  border-radius: ${({ width }) => width}px;
  background-color: ${({ color }) => theme.coreColors[color]};
  border: solid 2px
    ${({ selected }) =>
      selected ? theme.coreColors.white : theme.coreColors.black};

  display: flex;
  align-items: center;
  justify-content: center;
`;
