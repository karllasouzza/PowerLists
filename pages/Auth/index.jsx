import { useContext, useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

import { SlideProvider } from "../../context/slidePage";

import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import PrimaryButton from "../../components/PrimaryButton";

import {
  AccountContainer,
  AuthHeaderSection,
  AuthImage,
  AuthTitle,
  ContainerAuth,
} from "./styles";
import { useIsFocused } from "@react-navigation/native";
import { Button, Text, useTheme } from "react-native-paper";

const Auth = ({ navigation }) => {
  const isFocused = useIsFocused();
  const theme = useTheme();

  NavigationBar.setBackgroundColorAsync(theme.colors.tertiaryContainer);

  return (
    <ContainerAuth background={theme.colors.background}>
      <FocusAwareStatusBar color={theme.colors.background} />
      <AuthHeaderSection>
        <AuthImage source={require("../../assets/adaptive-icon.png")} />
        <AuthTitle
          color={theme.colors.onBackground}
          variant='headlineLarge'>
          Conecte-se
        </AuthTitle>
      </AuthHeaderSection>

      <AccountContainer background={theme.colors.background}>
        <Button
          onPress={() => navigation.navigate("CreateAccount")}
          buttonColor={theme.colors.primary}
          mode='elevated'
          style={{ width: "80%" }}>
          <Text
            variant='titleLarge'
            style={{ fontWeight: "bold", color: theme.colors.background }}>
            Criar conta
          </Text>
        </Button>
        <Button
          onPress={() => navigation.navigate("Login")}
          mode='outlined'
          style={{ width: "80%", borderWidth: 2 }}>
          <Text variant='titleLarge' style={{ fontWeight: "bold" }}>
            Entrar
          </Text>
        </Button>
      </AccountContainer>
    </ContainerAuth>
  );
};
export default Auth;
