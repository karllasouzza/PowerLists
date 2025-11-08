import React, { useState } from "react";

import ReturnIcon from "../../../assets/svgs/ReturnIcon";
import AddIcon from "../../../assets/svgs/AddIcon";
import {
  Footer,
  FooterIconContainer,
  FooterIconContainerAccent,
  FooterIconLabel,
} from "./styles";
// import PrimaryButton from "../PrimaryButton";
import HomeIcon from "../../../assets/svgs/HomeIcon";
import AccountIcon from "../../../assets/svgs/AccountIcon";
import EditIcon from "../../../assets/svgs/EditIcon";

export default ({
  background,
  iconColor,
  onIconColor,
  onIconBackground,
  returnColor,
  returnBackground,
  mode,
  route,
  homeHandle,
  accountHandle,
  addHandle,
  addNewItem,
  editItems,
  returnOfMode,
}) => {
  const defaultFooter = () => (
    <Footer background={background}>
      <FooterIconContainer
        background={route === "Home" ? onIconBackground : background}
        onPress={() => homeHandle()}>
        <HomeIcon
          width={20}
          background={route === "Home" ? onIconColor : iconColor}
          on={route === "Home"}
        />
        <FooterIconLabel color={route === "Home" ? onIconColor : iconColor}>
          Inicio
        </FooterIconLabel>
      </FooterIconContainer>
      <FooterIconContainerAccent
        border={onIconBackground}
        background={background}
        onPress={addHandle}>
        {mode === "account" ? (
          <EditIcon background={onIconBackground} width={30} />
        ) : (
          <AddIcon background={onIconBackground} width={35} />
        )}
      </FooterIconContainerAccent>
      <FooterIconContainer
        background={route === "Account" ? onIconBackground : background}
        onPress={() => accountHandle()}>
        <AccountIcon
          background={route === "Account" ? onIconColor : iconColor}
          width={20}
        />
        <FooterIconLabel color={route === "Account" ? onIconColor : iconColor}>
          Conta
        </FooterIconLabel>
      </FooterIconContainer>
    </Footer>
  );

  const actionFooter = () => (
    <Footer background={background}>
      <PrimaryButton
        width={15}
        background={onIconBackground}
        color={onIconColor}
        clickEvent={mode === "add" ? addNewItem : editItems}>
        {mode === "add" ? "Adicionar" : "Editar"}
      </PrimaryButton>
      <FooterIconContainer background={returnBackground} onPress={returnOfMode}>
        <ReturnIcon background={returnColor} width={20} />
        <FooterIconLabel color={returnColor}>Voltar</FooterIconLabel>
      </FooterIconContainer>
    </Footer>
  );

  const defaultListItemFooter = () => (
    <Footer background={background}>
      <FooterIconContainer
        background={route === "Home" ? onIconBackground : background}
        onPress={() => homeHandle()}>
        <ReturnIcon
          width={20}
          background={route === "Home" ? onIconColor : iconColor}
          // on={route === "Home"}
        />
        <FooterIconLabel color={route === "Home" ? onIconColor : iconColor}>
          Voltar
        </FooterIconLabel>
      </FooterIconContainer>
      <FooterIconContainerAccent
        border={onIconBackground}
        background={background}
        onPress={addHandle}>
        <AddIcon background={onIconBackground} width={35} />
      </FooterIconContainerAccent>
      <FooterIconContainer
        background={route === "Account" ? onIconBackground : background}
        onPress={() => accountHandle()}>
        <AccountIcon
          background={route === "Account" ? onIconColor : iconColor}
          width={20}
        />
        <FooterIconLabel color={route === "Account" ? onIconColor : iconColor}>
          Conta
        </FooterIconLabel>
      </FooterIconContainer>
    </Footer>
  );

  switch (mode) {
    case "add":
      return actionFooter();
    case "edit":
      return actionFooter();
    case "listItem":
      return defaultListItemFooter();
    default:
      return defaultFooter();
  }
};
