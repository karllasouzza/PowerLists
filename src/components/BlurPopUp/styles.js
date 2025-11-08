import { styled } from "styled-components/native";

export const Blur = styled.Pressable`
  width: 100%;
  height: 100%;

  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${({ zIndex }) => zIndex};

  background-color: ${({ background }) => background};
  opacity: 0.4000000059604645;
`;
