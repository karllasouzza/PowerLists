import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import {
  AccountContainer,
  AuthHeaderSection,
  AuthImage,
  AuthTitle,
  ContainerAuth,
} from "./styles";
import PrimaryButton from "../../components/PrimaryButton";
import theme from "../../assets/theme.json";
import * as NavigationBar from "expo-navigation-bar";
import { SlideProvider } from "../../context/slidePage";

const Auth = ({ navigation }) => {
  NavigationBar.setBackgroundColorAsync(theme.palettes.secondary[90]);

  return (
    <SlideProvider>
      <ContainerAuth background={theme.palettes.primary[99]}>
        <FocusAwareStatusBar color={theme.palettes.primary[99]} />
        <AuthHeaderSection>
          <AuthImage
            source={require("../../assets/Images/Auth/Illustration_one.png")}
          />
          <AuthTitle color={theme.coreColors.black}>Conecte-se</AuthTitle>
          <PrimaryButton
            clickEvent={() => navigation.navigate("Login")}
            background={theme.coreColors.primary}
            color={theme.coreColors.white}>
            Entrar
          </PrimaryButton>
        </AuthHeaderSection>

        <AccountContainer background={theme.palettes.secondary[90]}>
          <PrimaryButton
            clickEvent={() => navigation.navigate("CreateAccount")}
            background={theme.coreColors.secondary}
            color={theme.coreColors.white}>
            Criar Conta
          </PrimaryButton>
        </AccountContainer>
      </ContainerAuth>
    </SlideProvider>
  );
};
export default Auth;
