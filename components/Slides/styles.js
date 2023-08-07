import { styled } from "styled-components/native";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";

export const Slides_container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-evenly;
  background-color: ${({ background }) => background};
  padding: 10px 10px;
  transition: all 0.5s ease-in-out;
`;

export const Slide_image = styled.Image`
  height: ${() => responsiveHeight(35)}px;
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
  color: ${({ color }) => color};
  text-align: center;
  font-size: ${() => responsiveFontSize(3.5)}px;

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
  color: ${({ color }) => color};
  text-align: center;
  font-size: ${() => responsiveFontSize(2)}px;
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
