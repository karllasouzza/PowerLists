import React from "react";
import { ButtonBackground, ButtonText, ButtonTouch } from "./styles";
// import ReloadIcon from "../../assets/svgs/ReloadIcon";

export default ({
  children,
  background,
  color,
  clickEvent,
  loading,
  width,
  mode,
  buttonColor,
}) => {
  return (
    <ButtonTouch
      mode={mode}
      buttonColor={buttonColor}
      onPress={() => clickEvent()}
      width={width}>
      <ButtonText color={color}>{children}</ButtonText>
      <ButtonBackground background={background} />
    </ButtonTouch>
  );
};
