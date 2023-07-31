import { styled } from "styled-components/native";
import { Header } from "../../pages/Home/styles";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export const Footer = styled(Header)`
  z-index: 2;
  margin-bottom: 0;
  gap: 10px;

  background-color: ${({ background }) => background};
`;

export const FooterIconContainer = styled.Pressable`
  width: 100px;
  height: 55px;
  border-radius: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ background }) => background};
`;

export const FooterIconContainerAccent = styled(FooterIconContainer)`
  width: 70px;
  height: 70px;

  background-color: ${({ background }) => background};
  border: solid 2px ${({ border }) => border};

  position: absolute;
  top: -50%;
  right: 50%;
  left: 50%;
`;

export const FooterIconLabel = styled.Text`
  width: 100%;
  text-align: center;

  font-size: ${responsiveFontSize(1.6)}px;
  color: ${({ color }) => color};
  font-weight: bold;
`;
