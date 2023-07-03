import React, { useState } from "react";
import { Input, InputContainer, InputIcon, InputLabel } from "./styles";
import { Ionicons } from "@expo/vector-icons";

export default ({
  labelValue,
  labelColor,
  labelBackground,
  type,
  autoComplete,
  secure,
  activeIconColor,
  offIconColor,
  changeHandle,
}) => {
  const [view, setView] = useState(true);
  return (
    <InputContainer>
      <InputLabel color={labelColor} background={labelBackground}>
        {labelValue}
      </InputLabel>
      <Input
        inputMode={type}
        autoComplete={autoComplete}
        secureTextEntry={secure ? view : false}
        cursorColor={labelColor}
        onChangeText={(value) => changeHandle(value)}
      />
      {secure ? (
        <InputIcon onPress={() => setView(!view)}>
          <Ionicons
            name={view ? "eye" : "eye-off"}
            size={28}
            color={view ? offIconColor : activeIconColor}
          />
        </InputIcon>
      ) : null}
    </InputContainer>
  );
};
