import { MenuContext } from "../../context/menu-provider";
import { useCallback, useContext, useState } from "react";
import { View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  Provider,
  TextInput,
} from "react-native-paper";

export const JoinTeamPortal = ({ children }) => {
  const { handleHide } = useContext(MenuContext);

  const onDialogDismiss = useCallback(() => {
    handleHide({
      dialogType: "listPortal",
    });
  }, [handleHide]);

  return (
    <Provider>
      <Portal>{children}</Portal>
    </Provider>
  );
};
