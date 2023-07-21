import React, { useContext, useState } from "react";
import theme from "../../../assets/theme.json";
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

export default () => {
  NavigationBar.setBackgroundColorAsync(theme.palettes.primary[99]);

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
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <LoginScrollView background={theme.palettes.primary[99]}>
      <LoginContainer background={theme.palettes.primary[99]}>
        <FocusAwareStatusBar color={theme.palettes.primary[99]} />

        <LoginHeader>
          <LoginImage
            source={require("../../../assets/Images/Auth/Login/Illustration_one.png")}
          />
          <LoginTitle color={theme.coreColors.black}>
            Seja bem vindo!
          </LoginTitle>
        </LoginHeader>

        <LoginForm>
          <PrimaryInput
            width={20}
            labelValue='E-Mail'
            labelBackground={theme.palettes.primary[99]}
            labelColor={theme.coreColors.black}
            autoComplete='email'
            type='text'
            secure={false}
            changeHandle={setEmail}
          />

          <PrimaryInput
            width={20}
            labelValue='Senha'
            labelBackground={theme.palettes.primary[99]}
            labelColor={theme.coreColors.black}
            autoComplete='off'
            type='text'
            secure={true}
            activeIconColor={theme.coreColors.primary}
            offIconColor={theme.coreColors.black}
            changeHandle={setPassword}
          />
          <PrimaryButton
            background={theme.coreColors.primary}
            color={theme.coreColors.white}
            clickEvent={login}
            loading={loading}>
            Entrar
          </PrimaryButton>
        </LoginForm>
      </LoginContainer>
    </LoginScrollView>
  );
};
