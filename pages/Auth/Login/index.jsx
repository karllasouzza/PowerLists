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
import PrimaryButton from "../../../components/PrimaryButton";
import * as NavigationBar from "expo-navigation-bar";
import AuthContext from "../../../context/auth";
import ColorModeContext from "../../../context/colorMode";

export default () => {

  const { colorScheme, theme } = useContext(ColorModeContext);

  NavigationBar.setBackgroundColorAsync(theme.schemes[colorScheme].primaryContainer);

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
    <LoginScrollView background={theme.schemes[colorScheme].primaryContainer}>
      <LoginContainer background={theme.schemes[colorScheme].primaryContainer}>
        <FocusAwareStatusBar color={theme.schemes[colorScheme].primaryContainer} />

        <LoginHeader>
          <LoginImage
            source={require("../../../assets/Images/Auth/Login/Illustration_one.png")}
          />
          <LoginTitle color={theme.schemes[colorScheme].onPrimaryContainer}>
            Seja bem vindo!
          </LoginTitle>
        </LoginHeader>

        <LoginForm>
          <PrimaryInput
            width={20}
            labelValue='E-Mail'
            labelBackground={theme.schemes[colorScheme].primaryContainer}
            labelColor={theme.schemes[colorScheme].onPrimaryContainer}
            autoComplete='email'
            type='text'
            secure={false}
            changeHandle={setEmail}
          />

          <PrimaryInput
            width={20}
            labelValue='Senha'
            labelBackground={theme.schemes[colorScheme].primaryContainer}
            labelColor={theme.schemes[colorScheme].onPrimaryContainer}
            autoComplete='off'
            type='text'
            secure={true}
            activeIconColor={theme.schemes[colorScheme].primary}
            offIconColor={theme.schemes[colorScheme].onPrimaryContainer}
            changeHandle={setPassword}
          />
          <PrimaryButton
            background={theme.schemes[colorScheme].primary}
            color={theme.schemes[colorScheme].onPrimaryContainer}
            clickEvent={login}
            loading={loading}>
            Entrar
          </PrimaryButton>
        </LoginForm>
      </LoginContainer>
    </LoginScrollView>
  );
};
