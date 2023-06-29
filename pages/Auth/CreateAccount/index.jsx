import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";

import React, { useState } from "react";
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
import InputAccountForm from "../../../components/InputAccountForm";
import PrimaryButton from "../../../components/PrimaryButton";
import { supabase } from "../../../lib/supabase";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export default () => {
  NavigationBar.setBackgroundColorAsync(theme.palettes.tertiary[95]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Sucesso",
      text2: "Conta criada!",
    });
  };

  async function register() {
    setLoading(true);
    const { user, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });
    if (!error && !user) {
      setLoading(false);
      showToast();
    }
    if (error) {
      setLoading(false);
      alert(error.message);
    }
  }

  return (
    <AccountScrollView>
      <CreateAccountContainer>
        <FocusAwareStatusBar color={theme.palettes.tertiary[95]} />

        <CreateAccountHeader>
          <CreateAccountImage
            source={require("../../../assets/Images/Auth/Account/Illustration_one.png")}
          />
          <CreateAccountTitle>Seja bem vindo!</CreateAccountTitle>
        </CreateAccountHeader>

        <CreateAccountForm>
          <InputAccountForm
            labelValue='Nome'
            labelBackground={theme.palettes.tertiary[95]}
            labelColor={theme.coreColors.black}
            autoComplete='name'
            type='text'
            secure={false}
            changeHandle={setName}
          />

          <InputAccountForm
            labelValue='E-Mail'
            labelBackground={theme.palettes.tertiary[95]}
            labelColor={theme.coreColors.black}
            autoComplete='email'
            type='text'
            secure={false}
            changeHandle={setEmail}
          />

          <InputAccountForm
            labelValue='Senha'
            labelBackground={theme.palettes.tertiary[95]}
            labelColor={theme.coreColors.black}
            autoComplete='off'
            type='text'
            secure={true}
            activeIconColor={theme.coreColors.tertiary}
            offIconColor={theme.coreColors.black}
            changeHandle={setPassword}
          />
          <PrimaryButton
            background={theme.coreColors.tertiary}
            color={theme.coreColors.white}
            clickEvent={register}>
            Criar Conta
          </PrimaryButton>
        </CreateAccountForm>
      </CreateAccountContainer>
    </AccountScrollView>
  );
};
