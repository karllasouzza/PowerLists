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
}) => {
  return (
    <ButtonTouch onPress={() => clickEvent()} width={width}>
      {loading ? (
        <ReloadIcon background={color} width={30} on={loading} />
      ) : (
        <ButtonText color={color}>{children}</ButtonText>
      )}
      <ButtonBackground background={background} />
    </ButtonTouch>
  );
};
