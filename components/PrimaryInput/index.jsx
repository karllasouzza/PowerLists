import React, { useState } from "react";
import { TextInput } from "react-native-paper";

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
    <TextInput
      mode='outlined'
      inputMode={type}
      label={labelValue}
      autoComplete={autoComplete}
      secureTextEntry={view}
      style={{ width: width + "%" }}
      cursorColor={labelColor}
      color={labelColor}
      onChangeText={(value) => changeHandle(value)}
      value={edit ? value : null}
      right={
        secure ? (
          <TextInput.Icon icon='eye' onPress={() => setView(!view)} />
        ) : null
      }
    />
  );
};
