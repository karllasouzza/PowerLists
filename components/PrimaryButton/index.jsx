import React from "react";
import { ButtonBackground, ButtonText, ButtonTouch } from "./styles";

export default ({ children, background, color, clickEvent, loading }) => {
  return (
    <ButtonTouch onPress={() => clickEvent()}>
      <ButtonText color={color}>{children}</ButtonText>
      <ButtonBackground background={background} />
    </ButtonTouch>
  );
};
