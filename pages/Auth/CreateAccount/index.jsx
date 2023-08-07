import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";

import React, { useContext, useState } from "react";
import {
  AccountScrollView,
  CreateAccountContainer,
  CreateAccountForm,
  CreateAccountHeader,
  CreateAccountImage,
  CreateAccountTitle,
} from "./styles";
import theme from "../../../assets/theme.json";
import * as NavigationBar from "expo-navigation-bar";
import PrimaryButton from "../../../components/PrimaryButton";
import PrimaryInput from "../../../components/PrimaryInput";
import AuthContext from "../../../context/auth";
import { showToast } from "../../../services/toast";
import ColorModeContext from "../../../context/colorMode";

export default ({ navigation }) => {
  const { colorScheme, theme } = useContext(ColorModeContext);

  NavigationBar.setBackgroundColorAsync(
    theme.schemes[colorScheme].tertiaryContainer
  );

  const { singUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function register() {
    if (validateName() && validateEmail() && validatePassword()) {
      setLoading(true);
      await singUp(name, email, password);
      setLoading(false);
    }
  }

  const validateName = () => {
    if (name.length < 3) {
      showToast({
        type: "error",
        title: "Nome inválido!",
        subtitle: "O nome deve ter pelo menos 3 caracteres",
      });
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!regex.test(email)) {
      showToast({
        type: "error",
        title: "E-mail inválido!",
        subtitle: "Formato de email invalido",
      });
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (password.length < 7) {
      showToast({
        type: "error",
        title: "Senha incorreta!",
        subtitle: "A senha deve ter pelo menos 7 caracteres",
      });
      return false;
    }
    return true;
  };

  return (
    <AccountScrollView background={theme.schemes[colorScheme].tertiaryContainer}>
      <CreateAccountContainer background={theme.schemes[colorScheme].tertiaryContainer}>
        <FocusAwareStatusBar color={theme.schemes[colorScheme].tertiaryContainer} />

        <CreateAccountHeader>
          <CreateAccountImage
            source={require("../../../assets/Images/Auth/Account/Illustration_one.png")}
          />
          <CreateAccountTitle color={theme.schemes[colorScheme].onTertiaryContainer}>
            Seja bem vindo!
          </CreateAccountTitle>
        </CreateAccountHeader>

        <CreateAccountForm>
          <PrimaryInput
            labelValue='Nome'
            labelBackground={theme.schemes[colorScheme].tertiaryContainer}
            labelColor={theme.schemes[colorScheme].onTertiaryContainer}
            autoComplete='name'
            type='text'
            secure={false}
            changeHandle={setName}
          />

          <PrimaryInput
            labelValue='E-Mail'
            labelBackground={theme.schemes[colorScheme].tertiaryContainer}
            labelColor={theme.schemes[colorScheme].onTertiaryContainer}
            autoComplete='email'
            type='text'
            secure={false}
            changeHandle={setEmail}
          />

          <PrimaryInput
            labelValue='Senha'
            labelBackground={theme.schemes[colorScheme].tertiaryContainer}
            labelColor={theme.schemes[colorScheme].onTertiaryContainer}
            autoComplete='off'
            type='text'
            secure={true}
            activeIconColor={theme.schemes[colorScheme].tertiary}
            offIconColor={theme.schemes[colorScheme].onTertiaryContainer}
            changeHandle={setPassword}
          />
          <PrimaryButton
            background={theme.schemes[colorScheme].tertiary}
            color={theme.schemes[colorScheme].onTertiaryContainer}
            clickEvent={register}
            loading={loading}>
            Criar Conta
          </PrimaryButton>
        </CreateAccountForm>
      </CreateAccountContainer>
    </AccountScrollView>
  );
};
