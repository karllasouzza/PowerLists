import { Modal } from "react-native-paper";
import { styled } from "styled-components/native";

export const NewListItemContainer = styled(Modal)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  transition: all 0.5s ease-in-out;
  z-index: 2;
`;

export const NewListItemForm = styled.View`
  width: 90%;
  height: 60%;
  border-radius: 30px;
  padding: 10px 20px;

  background-color: aqua;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;

  transition: all 0.5s ease-in-out;
`;

export const NewListItemFormRow = styled.View`
  width: 100%;

  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-between;
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
