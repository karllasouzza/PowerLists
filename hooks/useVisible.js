import { useState } from "react";

export const useVisible = () => {
  const [joinPortalDialogVisible, setJoinPortalDialogVisible] = useState(false);
  const [feedbackDialogVisible, setFeedbackDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const handleShow = ({ dialogType }) => {
    switch (dialogType) {
      case "joinPortal": {
        setJoinPortalDialogVisible(true);

        break;
      }
      case "feedback": {
        setFeedbackDialogVisible(true);

        break;
      }
      case "delete": {
        setDeleteDialogVisible(true);

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
      case "joinPortal": {
        setJoinPortalDialogVisible(false);

        break;
      }
      case "feedback": {
        setFeedbackDialogVisible(false);

        break;
      }
      case "delete": {
        setDeleteDialogVisible(false);

        break;
      }
      default: {
        break;
      }
    }
    return true;
  };

  const handleHideAll = () => {
    setJoinPortalDialogVisible(false);
    setFeedbackDialogVisible(false);
    setDeleteDialogVisible(false);
  };

  return {
    deleteDialogVisible,
    feedbackDialogVisible,
    handleHide,
    handleHideAll,
    handleShow,
    joinPortalDialogVisible,
  };
};
