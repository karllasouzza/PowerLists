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
    <SlideProvider>
      <ContainerAuth background={theme.colors.primaryContainer}>
        <FocusAwareStatusBar color={theme.colors.primaryContainer} />
        <AuthHeaderSection>
          <AuthImage
            source={require("../../assets/Images/Auth/Illustration_one.png")}
          />
          <AuthTitle color={theme.colors.onPrimaryContainer} variant="headlineLarge">
            Conecte-se
          </AuthTitle>
          <Button
            onPress={() => navigation.navigate("CreateAccount")}
            background={theme.colors.primary}
            mode='elevated'
            style={{ width: "80%" }}>
            <Text variant='titleLarge' style={{ fontWeight: "bold" }}>
              Criar conta
            </Text>
          </Button>
        </AuthHeaderSection>

        <AccountContainer background={theme.colors.tertiaryContainer}>
          <Button
            onPress={() => navigation.navigate("Login")}
            background={theme.colors.primary}
            mode='outlined'
            style={{ width: "80%", borderWidth: 2 }}>
            <Text variant='titleLarge' style={{ fontWeight: "bold" }}>
              Entrar
            </Text>
          </Button>
        </AccountContainer>
      </ContainerAuth>
    </SlideProvider>
  );
};
export default Auth;
