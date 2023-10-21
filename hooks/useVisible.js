import { useState } from "react";

export const useVisible = () => {
  const [listPortalScreenVisible, setListPortalScreenVisible] = useState(false);

  const handleShow = ({ dialogType }) => {
    switch (dialogType) {
      case "listPortal": {
        setListPortalScreenVisible(true);
        break;
      }
      default: {
        break;
      }
    }
    return true;
  };

  const handleHide = ({ dialogType }) => {
    switch (dialogType) {
      case "listPortal": {
        setListPortalScreenVisible(false);
        break;
      }
      default: {
        break;
      }
    }
    return true;
  };

  const handleHideAll = () => {
    setListPortalScreenVisible(false);
  };

  return {
    listPortalScreenVisible,
    handleHide,
    handleHideAll,
    handleShow,
  };
};
