import PropTypes from "prop-types";
import { createContext, useState } from "react";

const MenuContext = createContext();

const MenuContextProvider = ({ children }) => {
  const [listPortalScreenVisible, setListPortalScreenVisible] = useState(false);

  const handleShow = ({ dialogType }) => {
    switch (dialogType) {
      case "listPortal":
        setListPortalScreenVisible(true);
        break;
      default:
        break;
    }
    return true;
  };

  const handleHide = ({ dialogType }) => {
    switch (dialogType) {
      case "listPortal":
        setListPortalScreenVisible(false);
        break;

      default:
        break;
    }
    return true;
  };

  const handleHideAll = () => {
    setListPortalScreenVisible(false);
  };

  return (
    <MenuContext.Provider
      value={{
        handleShow,
        handleHide,
        handleHideAll,
        listPortalScreenVisible,
      }}>
      {children}
    </MenuContext.Provider>
  );
};

MenuContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MenuContext, MenuContextProvider };
