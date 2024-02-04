import { MenuContext } from "../../context/menu-provider";
import { useCallback, useContext } from "react";
import { Portal, Provider } from "react-native-paper";

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
