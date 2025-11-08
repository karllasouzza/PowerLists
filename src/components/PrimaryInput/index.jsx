import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { Input } from "./styles";
import { responsiveWidth } from "react-native-responsive-dimensions";

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
      mode="outlined"
      inputMode={type}
      label={labelValue}
      textColor={labelColor}
      outlineColor={labelColor}
      activeOutlineColor={labelColor}
      autoComplete={autoComplete}
      secureTextEntry={view}
      cursorColor={labelColor}
      contentStyle={{ color: labelColor }}
      onChangeText={(value) => changeHandle(value)}
      outlineStyle={{ borderRadius: 20, borderColor: labelColor }}
      value={value}
      style={{
        width: responsiveWidth(width),
        backgroundColor: labelBackground,
        color: labelColor,
      }}
      right={
        secure ? (
          <TextInput.Icon
            icon={view ? "eye" : "eye-off"}
            onPress={() => setView(!view)}
          />
        ) : null
      }
    />
  );
};
