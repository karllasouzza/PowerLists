import { responsiveHeight } from "react-native-responsive-dimensions";
import { styled } from "styled-components/native";

export const NewListItemContainer = styled.View`
  width: 90%;
  height: ${() => responsiveHeight(25)}px;
  border-radius: 30px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  transition: all 0.5s ease-in-out;
`;

export const NewListItemForm = styled.View`
  width: 100%;
  height: 100%;
  border-radius: 30px;
  padding:10px 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;

  transition: all 0.5s ease-in-out;
`;

export const NewListItemFormRow = styled.View`
  width: 100%;

  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const NewListItemContainerBackground = styled(NewListItemContainer)`
  width: 100%;

  background: ${({ background }) => background};

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  
`;
