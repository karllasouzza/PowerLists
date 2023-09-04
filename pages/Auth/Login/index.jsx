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
import * as NavigationBar from "expo-navigation-bar";
import AuthContext from "../../../context/auth";
import { Button, Text, useTheme } from "react-native-paper";

export default () => {
  const theme = useTheme();

  NavigationBar.setBackgroundColorAsync(theme.colors.primaryContainer);

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
    <LoginScrollView background={theme.colors.primaryContainer}>
      <LoginContainer background={theme.colors.primaryContainer}>
        <FocusAwareStatusBar color={theme.colors.primaryContainer} />

        <LoginHeader>
          <LoginImage
            source={require("../../../assets/Images/Auth/Login/Illustration_one.png")}
          />
          <LoginTitle
            color={theme.colors.onPrimaryContainer}
            variant='headlineLarge'>
            Seja bem vindo!
          </LoginTitle>
        </LoginHeader>

        <LoginForm>
          <PrimaryInput
            width={80}
            labelValue='E-Mail'
            labelBackground={theme.colors.primaryContainer}
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
          <Button
            mode='elevated'
            style={{ width: "80%" }}
            buttonColor={theme.colors.primary}
            onPress={login}>
            <Text
              variant='titleLarge'
              style={{ fontWeight: "bold", color: theme.colors.onPrimary }}>
              Entrar
            </Text>
          </Button>
        </LoginForm>
      </LoginContainer>
    </LoginScrollView>
  );
};
