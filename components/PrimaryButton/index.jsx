import React from "react";
import { ButtonBackground, ButtonText, ButtonTouch } from "./styles";

export default ({
  children,
  background,
  color,
  clickEvent,
  loading,
  width,
}) => {
  return (
    <ButtonTouch onPress={() => clickEvent()} width={width}>
      <ButtonText color={color}>{children}</ButtonText>
      <ButtonBackground background={background} />
    </ButtonTouch>
  );
};
