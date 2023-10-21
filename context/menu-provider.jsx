import PropTypes from "prop-types";
import { useMemo } from "react";
import { useVisible } from "../hooks/useVisible";
import { MenuContext } from "./contexts";

const MenuContextProvider = ({ children }) => {
  const { handleHideAll, handleHide, handleShow, listPortalScreenVisible } =
    useVisible();

  const value = useMemo(
    () => ({
      handleHide,
      handleHideAll,
      handleShow,
      listPortalScreenVisible,
    }),
    [handleHideAll, handleHide, handleShow, listPortalScreenVisible]
  );

  console.log(MenuContext === undefined);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

MenuContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MenuContext, MenuContextProvider };
