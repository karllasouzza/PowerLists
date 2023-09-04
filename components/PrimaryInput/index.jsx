import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { Input } from "./styles";

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
  width,
  edit,
  value,
}) => {
  const [view, setView] = useState(secure);

  return (
    <Input
      mode='outlined'
      inputMode={type}
      label={labelValue}
      autoComplete={autoComplete}
      secureTextEntry={view}
      cursorColor={labelColor}
      color={labelColor}
      onChangeText={(value) => changeHandle(value)}
      value={value}
      right={
        secure ? (
          <TextInput.Icon icon='eye' onPress={() => setView(!view)} />
        ) : null
      }
    />
  );
};
