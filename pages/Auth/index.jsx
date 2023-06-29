import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import { SlideProvider } from "../../context/slidePage";
import {
  AccountContainer,
  ContainerLogin,
  LoginHeaderSection,
  LoginImage,
  LoginTitle,
} from "./styles";
import PrimaryButton from "../../components/PrimaryButton";
import theme from "../../assets/theme.json";
import * as NavigationBar from "expo-navigation-bar";

const Auth = ({ navigation }) => {
  NavigationBar.setBackgroundColorAsync(theme.palettes.secondary[80]);
  return (
    <SlideProvider>
      <ContainerLogin>
        <FocusAwareStatusBar color={theme.palettes.primary[90]} />
        <LoginHeaderSection>
          <LoginImage
            source={require("../../assets/Images/Auth/Illustration_one.png")}
          />
          <LoginTitle>Conecte-se</LoginTitle>
          <PrimaryButton
            clickEvent={() => navigation.navigate("Login")}
            background={theme.coreColors.primary}
            color={theme.coreColors.white}>
            Entrar
          </PrimaryButton>
        </LoginHeaderSection>

        <AccountContainer>
          <PrimaryButton
            clickEvent={() => navigation.navigate("Account")}
            background={theme.coreColors.secondary}
            color={theme.coreColors.white}>
            Criar Conta
          </PrimaryButton>
        </AccountContainer>
      </ContainerLogin>
    </SlideProvider>
  );
};
export default Auth;
