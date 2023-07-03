import { styled } from "styled-components/native";
import theme from "../../assets/theme.json";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { ButtonText } from "../PrimaryButton/styles";

export const InputContainer = styled.View`
  height: 50px;
  width: ${() => responsiveWidth(20)}%;

  border: 2px solid ${theme.coreColors.black};
  border-radius: 10px;
`;

export const InputLabel = styled(ButtonText)`
  color: ${({ color }) => color};
  background-color: ${({ background }) => background};
  width: auto;

  position: absolute;
  top: -13px;
  left: 20px;
  padding: 0 10px;
`;
export const Input = styled.TextInput`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding: 10px;
`;

export const InputIcon = styled.Pressable`
  height: 100%;
  right: 10px;
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
`;
