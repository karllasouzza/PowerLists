import { styled } from "styled-components/native";
import theme from "../../assets/theme.json";
import CheckBox from "../svgs/CheckBox";

export const Slides_container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-evenly;
  background-color: ${({ background }) => background};
  padding: 10px 10px;
  transition: all 0.5s ease-in-out;
`;

export const Slide_image = styled.Image`
  width: 70%;
  object-fit: contain;
`;

export const Slide_Text_View = styled.View`
  height: 100px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition: all 0.5s ease-in-out;
`;

export const Slide_title = styled.Text`
  color: ${theme.palettes.neutral[0]};
  text-align: center;
  font-size: 26px;
  font-family: sans-serif;
  font-style: normal;
  font-weight: 700;
  text-transform: capitalize;
`;

export const Slide_subtitle = styled.Text`
  display: flex;
  width: 335px;
  padding: 10px;
  flex-direction: column;
  justify-content: center;
  color: ${theme.palettes.neutral[10]};
  text-align: center;
  font-size: 16px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.64px;
  text-transform: capitalize;
`;

export const Slide_Checkboxes_Container = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;
