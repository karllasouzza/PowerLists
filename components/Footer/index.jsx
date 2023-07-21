import React, { useState } from "react";
import theme from "../../assets/theme.json";

import ReturnIcon from "../../assets/svgs/ReturnIcon";
import TrashIcon from "../../assets/svgs/TrashIcon";
import AddIcon from "../../assets/svgs/AddIcon";
import EditIcon from "../../assets/svgs/EditIcon";
import { Footer, FooterIconContainer } from "./styles";
import PrimaryButton from "../PrimaryButton";

export default ({
  mode,
  setMode,
  addNewItem,
  returnOfAddMode,
  deleteItems,
  returnOfDeleteMode,
  editItems,
  returnOfEditMode,
}) => {
  const defaultFooter = () => (
    <Footer>
      <FooterIconContainer
        background={theme.palettes.error[90]}
        onPress={() => setMode("delete")}>
        <TrashIcon background={theme.coreColors.error} />
      </FooterIconContainer>
      <FooterIconContainer
        background={theme.palettes.primary[90]}
        onPress={() => setMode("add")}>
        <AddIcon background={theme.coreColors.primary} />
      </FooterIconContainer>
      <FooterIconContainer
        background={theme.palettes.tertiary[90]}
        onPress={() => setMode("edit")}>
        <EditIcon background={theme.coreColors.tertiary} width={20} />
      </FooterIconContainer>
    </Footer>
  );

  const addFooter = () => (
    <Footer>
      <PrimaryButton
        background={theme.coreColors.primary}
        color={theme.coreColors.white}
        clickEvent={addNewItem}>
        Adicionar
      </PrimaryButton>
      <FooterIconContainer
        background={theme.palettes.error[90]}
        onPress={returnOfAddMode}>
        <ReturnIcon background={theme.coreColors.error} width={25} />
      </FooterIconContainer>
    </Footer>
  );

  const deleteFooter = () => (
    <Footer>
      <PrimaryButton
        background={theme.coreColors.primary}
        color={theme.coreColors.white}
        clickEvent={() => deleteItems()}>
        Confirmar
      </PrimaryButton>
      <FooterIconContainer
        background={theme.palettes.error[90]}
        onPress={() => returnOfDeleteMode()}>
        <ReturnIcon background={theme.coreColors.error} width={25} />
      </FooterIconContainer>
    </Footer>
  );

  const editFooter = () => (
    <Footer>
      <PrimaryButton
        background={theme.coreColors.primary}
        color={theme.coreColors.white}
        clickEvent={() => editItems()}>
        Confirmar
      </PrimaryButton>
      <FooterIconContainer
        background={theme.palettes.error[90]}
        onPress={() => returnOfEditMode()}>
        <ReturnIcon background={theme.coreColors.error} width={25} />
      </FooterIconContainer>
    </Footer>
  );

  switch (mode) {
    case "add":
      return addFooter();
    case "delete":
      return deleteFooter();
    case "edit":
      return editFooter();
    default:
      return defaultFooter();
  }
};
