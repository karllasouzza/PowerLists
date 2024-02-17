import { styled } from "styled-components/native";

export const Color = styled.Pressable`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;

  border-radius: ${({ width }) => width}px;
  background-color: ${({ color, theme }) => theme.colors[color]};
  border: solid 2px
    ${({ selected, onSelectedColor, selectedColor }) =>
      selected ? onSelectedColor : selectedColor};

  display: flex;
  align-items: center;
  justify-content: center;
`;
