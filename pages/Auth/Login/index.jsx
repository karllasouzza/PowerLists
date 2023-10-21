import React, { useContext, useState } from "react";
import PrimaryInput from "../../../components/PrimaryInput";
import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import {
  LoginContainer,
  LoginForm,
  LoginHeader,
  LoginImage,
  LoginScrollView,
  LoginTitle,
} from "./styles";
import AuthContext from "../../../context/auth";
import { Button, Text, useTheme } from "react-native-paper";
import {
  ButtonNavigate,
  ChangeFormTipe,
  IHaveAccount,
} from "../CreateAccount/styles";

export default () => {
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { singIn } = useContext(AuthContext);

  const login = async () => {
    setLoading(true);

    try {
      await singIn(email, password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <LoginScrollView background={theme.colors.background}>
      <LoginContainer background={theme.colors.background}>
        <FocusAwareStatusBar color={theme.colors.background} />

        <LoginHeader>
          <LoginTitle
            variant='headlineMedium'
            color={theme.colors.onBackground}>
            Seja bem vindo de volta!
          </LoginTitle>
          <LoginTitle variant='bodyMedium' color={theme.colors.onBackground}>
            Acesse sua conta existente utilizando seu e-mail e senha.
          </LoginTitle>
        </LoginHeader>

        <LoginForm>
          <PrimaryInput
            width={80}
            labelValue='E-Mail'
            labelBackground={theme.colors.onBackground}
            labelColor={theme.colors.onPrimaryContainer}
            autoComplete='email'
            type='text'
            secure={false}
            changeHandle={setEmail}
          />
          <PrimaryInput
            width={80}
            labelValue='Senha'
            labelBackground={theme.colors.primaryContainer}
            labelColor={theme.colors.onPrimaryContainer}
            autoComplete='off'
            type='text'
            secure={true}
            activeIconColor={theme.colors.primary}
            offIconColor={theme.colors.onPrimaryContainer}
            changeHandle={setPassword}
          />
          <ButtonNavigate
            mode='text'
            color={theme.colors.background}
            onPress={() => navigation.navigate("CreateAccount")}>
            Esqueceu a senha?
          </ButtonNavigate>
          <Button
            mode='elevated'
            style={{ width: "80%" }}
            buttonColor={theme.colors.primary}
            onPress={login}
            loading={loading}>
            <Text
              variant='titleLarge'
              style={{ fontWeight: "bold", color: theme.colors.background }}>
              Entrar
            </Text>
          </Button>
        </LoginForm>
        <IHaveAccount>
          <ChangeFormTipe variant='bodyMedium'>
            Ainda não possui uma conta?{" "}
          </ChangeFormTipe>
          <ButtonNavigate
            mode='text'
            color={theme.colors.background}
            onPress={() => navigation.navigate("CreateAccount")}>
            Crie sua conta
          </ButtonNavigate>
        </IHaveAccount>
      </LoginContainer>
    </LoginScrollView>
  );
};
