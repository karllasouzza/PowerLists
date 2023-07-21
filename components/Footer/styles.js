import { styled } from "styled-components/native";
import { Header } from "../../pages/Home/styles";

export const Footer = styled(Header)``;

export const FooterIconContainer = styled.Pressable`
  width: 55px;
  height: 55px;
  border-radius: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ background }) => background};
`;
