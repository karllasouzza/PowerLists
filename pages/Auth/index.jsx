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
import { useTheme } from "react-native-paper";

const Auth = ({ navigation }) => {
  const isFocused = useIsFocused();
  const theme = useTheme();

  NavigationBar.setBackgroundColorAsync(theme.colors.secondaryContainer);

  return (
    <SlideProvider>
      <ContainerAuth background={theme.colors.primaryContainer}>
        <FocusAwareStatusBar color={theme.colors.primaryContainer} />
        <AuthHeaderSection>
          <AuthImage
            source={require("../../assets/Images/Auth/Illustration_one.png")}
          />
          <AuthTitle color={theme.colors.primaryContainer}>
            Conecte-se
          </AuthTitle>
          <PrimaryButton
            clickEvent={() => navigation.navigate("Login")}
            background={theme.colors.primary}
            color={theme.colors.onPrimaryContainer}>
            Entrar
          </PrimaryButton>
        </AuthHeaderSection>

        <AccountContainer background={theme.colors.secondaryContainer}>
          <PrimaryButton
            clickEvent={() => navigation.navigate("CreateAccount")}
            background={theme.colors.secondary}
            color={theme.colors.onSecondaryContainer}>
            Criar Conta
          </PrimaryButton>
        </AccountContainer>
      </ContainerAuth>
    </SlideProvider>
  );
};
export default Auth;
