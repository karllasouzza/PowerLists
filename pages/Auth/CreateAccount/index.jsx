import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";

import React, { useContext, useState } from "react";
import {
  AccountScrollView,
  ButtonNavigate,
  ChangeFormTipe,
  CreateAccountContainer,
  CreateAccountForm,
  CreateAccountHeader,
  CreateAccountImage,
  CreateAccountTitle,
  IHaveAccount,
} from "./styles";
import theme from "../../../assets/theme.json";
import * as NavigationBar from "expo-navigation-bar";
// import PrimaryButton from "../../../components/PrimaryButton";
import PrimaryInput from "../../../components/PrimaryInput";
import AuthContext from "../../../context/auth";
import { showToast } from "../../../services/toast";
// import ColorModeContext from "../../../context/colorMode";
import { Button, HelperText, Text, useTheme } from "react-native-paper";
import { Link } from "@react-navigation/native";

export default ({ navigation }) => {
  const theme = useTheme();

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
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!regex.test(email)) {
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (password.length < 7) {
      return false;
    }
    return true;
  };

  return (
    <AccountScrollView background={theme.colors.background}>
      <CreateAccountContainer background={theme.colors.background}>
        <FocusAwareStatusBar color={theme.colors.background} />

        <CreateAccountHeader>
          <CreateAccountTitle
            variant='headlineMedium'
            color={theme.colors.onBackground}>
            Seja bem vindo!
          </CreateAccountTitle>
          <CreateAccountTitle
            variant='bodyMedium'
            color={theme.colors.onBackground}>
            Cadastre seu nome, seu email e sua senha para poder usar os recursos
            de salvamento online...
          </CreateAccountTitle>
        </CreateAccountHeader>

        <CreateAccountForm>
          <PrimaryInput
            labelValue='Nome'
            labelBackground={theme.colors.tertiaryContainer}
            labelColor={theme.colors.onTertiaryContainer}
            autoComplete='name'
            type='text'
            secure={false}
            changeHandle={setName}
          />
          <HelperText type='error' visible={!validateName() && name}>
            O nome deve ter pelo menos 3 caracteres
          </HelperText>

          <PrimaryInput
            labelValue='E-Mail'
            labelBackground={theme.colors.tertiaryContainer}
            labelColor={theme.colors.onTertiaryContainer}
            autoComplete='email'
            type='text'
            secure={false}
            changeHandle={setEmail}
          />
          <HelperText type='error' visible={!validateEmail() && email}>
            Formato de email invalido
          </HelperText>

          <PrimaryInput
            labelValue='Senha'
            labelBackground={theme.colors.tertiaryContainer}
            labelColor={theme.colors.onTertiaryContainer}
            autoComplete='off'
            type='text'
            secure={true}
            activeIconColor={theme.colors.tertiary}
            offIconColor={theme.colors.onTertiaryContainer}
            changeHandle={setPassword}
          />
          <HelperText type='error' visible={!validatePassword() && password}>
            A senha deve ter pelo menos 7 caracteres
          </HelperText>

          <Button
            mode='elevated'
            style={{ width: "80%" }}
            buttonColor={theme.colors.primary}
            onPress={register}
            loading={loading}>
            <Text
              variant='titleLarge'
              style={{ fontWeight: "bold", color: theme.colors.background }}>
              Criar Conta
            </Text>
          </Button>
        </CreateAccountForm>
        <IHaveAccount>
          <ChangeFormTipe variant='bodyMedium'>
            Ja possui uma conta?{" "}
          </ChangeFormTipe>
          <ButtonNavigate
            mode='text'
            color={theme.colors.background}
            onPress={() => navigation.navigate("Login")}>
            Faça o login
          </ButtonNavigate>
        </IHaveAccount>
      </CreateAccountContainer>
    </AccountScrollView>
  );
};
