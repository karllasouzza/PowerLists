import styled from "styled-components/native";

export const BarcodeContainer = styled.View`
  width: 100%;
  height: max-content;
  min-height: 50%;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  background-color: ${({ background }) => background};
`;
