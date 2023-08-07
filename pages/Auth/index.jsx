import { useContext, useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

import { SlideProvider } from "../../context/slidePage";
import ColorModeContext from "../../context/colorMode";

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

const Auth = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { colorScheme, theme } = useContext(ColorModeContext);

  NavigationBar.setBackgroundColorAsync(
    theme.schemes[colorScheme].secondaryContainer
  );

  return (
    <SlideProvider>
      <ContainerAuth background={theme.schemes[colorScheme].primaryContainer}>
        <FocusAwareStatusBar
          color={theme.schemes[colorScheme].primaryContainer}
        />
        <AuthHeaderSection>
          <AuthImage
            source={require("../../assets/Images/Auth/Illustration_one.png")}
          />
          <AuthTitle color={theme.schemes[colorScheme].primaryContainer}>
            Conecte-se
          </AuthTitle>
          <PrimaryButton
            clickEvent={() => navigation.navigate("Login")}
            background={theme.schemes[colorScheme].primaryFixed}
            color={theme.schemes[colorScheme].onPrimaryContainer}>
            Entrar
          </PrimaryButton>
        </AuthHeaderSection>

        <AccountContainer
          background={theme.schemes[colorScheme].secondaryContainer}>
          <PrimaryButton
            clickEvent={() => navigation.navigate("CreateAccount")}
            background={theme.schemes[colorScheme].secondary}
            color={theme.schemes[colorScheme].onSecondaryContainer}>
            Criar Conta
          </PrimaryButton>
        </AccountContainer>
      </ContainerAuth>
    </SlideProvider>
  );
};
export default Auth;
