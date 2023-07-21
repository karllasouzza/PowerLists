import { styled } from "styled-components/native";
import theme from "../../assets/theme.json";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { ButtonText } from "../PrimaryButton/styles";

export const InputContainer = styled.View`
  height: 50px;
  width: ${({ width }) => responsiveWidth(width ? width : 20)}%;

  border: 2px solid ${theme.coreColors.black};
  border-radius: 20px;

  transition: all 0.5s ease-in-out;
`;

export const InputLabel = styled(ButtonText)`
  color: ${({ color }) => color};
  background-color: ${({ background, focus }) =>
    focus ? background : "transparent"};
  width: auto;

  position: absolute;
  top: ${({ focus }) => (focus ? "-13px" : "10px")};
  left: ${({ focus }) => (focus ? "20px" : 0)};
  padding: 0 10px;
  border-radius: 20px;
`;
export const Input = styled.TextInput`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding: 10px;
`;

export const InputIcon = styled.Pressable`
  height: 100%;
  right: 10px;
  margin: 0 auto;
  border-radius: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
`;
