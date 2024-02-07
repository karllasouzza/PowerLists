import React, { useContext, useState } from "react";
import PrimaryInput from "../../../components/PrimaryInput";
import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import {
  PasswordResetContainer,
  PasswordResetForm,
  PasswordResetHeader,
  PasswordResetScrollView,
  PasswordResetTitle,
} from "./styles";
import AuthContext from "../../../context/auth";
import { Button, Text, useTheme } from "react-native-paper";

export default ({ navigation }) => {
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const { changePassword } = useContext(AuthContext);

  const resetPassword = async () => {
    setLoading(true);

    try {
      await changePassword(email);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PasswordResetScrollView background={theme.colors.background}>
      <PasswordResetContainer background={theme.colors.background}>
        <FocusAwareStatusBar
          color={theme.colors.background}
          navColor={theme.colors.background}
        />
        <PasswordResetHeader>
          <PasswordResetTitle
            variant='headlineMedium'
            color={theme.colors.onBackground}>
            Recuperar senha!
          </PasswordResetTitle>
          <PasswordResetTitle
            variant='bodyMedium'
            color={theme.colors.onBackground}>
            Recupere sua conta existente através do seu e-mail.
          </PasswordResetTitle>
        </PasswordResetHeader>

        <PasswordResetForm>
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

          {recoveryMode ? (
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
          ) : null}

          {recoveryMode ? (
            <PrimaryInput
              width={80}
              labelValue='Confirmar senha'
              labelBackground={theme.colors.primaryContainer}
              labelColor={theme.colors.onPrimaryContainer}
              autoComplete='off'
              type='text'
              secure={true}
              activeIconColor={theme.colors.primary}
              offIconColor={theme.colors.onPrimaryContainer}
              changeHandle={setPasswordConfirm}
            />
          ) : null}

          <Button
            mode='elevated'
            style={{ width: "80%" }}
            buttonColor={theme.colors.primary}
            onPress={resetPassword}
            loading={loading}>
            <Text
              variant='titleLarge'
              style={{ fontWeight: "bold", color: theme.colors.background }}>
              Recuperar senha
            </Text>
          </Button>
        </PasswordResetForm>
      </PasswordResetContainer>
    </PasswordResetScrollView>
  );
};
