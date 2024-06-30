import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";

import {
  AccountContainer,
  AuthHeaderSection,
  AuthImage,
  AuthTitle,
  ContainerAuth,
} from "./styles";
import { Button, Text, useTheme } from "react-native-paper";

const Auth = ({ navigation }) => {
  const theme = useTheme();

  return (
    <ContainerAuth background={theme.colors.background}>
      <FocusAwareStatusBar
        color={theme.colors.background}
        navColor={theme.colors.tertiaryContainer}
      />
      <AuthHeaderSection>
        <AuthImage source={require("../../assets/adaptive-icon.png")} />
        <AuthTitle variant='headlineMedium' color={theme.colors.onBackground}>
          Bem-vindo!
        </AuthTitle>
        <AuthTitle variant='bodyMedium' color={theme.colors.onBackground}>
          Guarde seus dados localmente ou opte por se conectar e armazenar suas
          informações na nuvem.
        </AuthTitle>
      </AuthHeaderSection>

      <AccountContainer background={theme.colors.background}>
        <Button
          onPress={() => navigation.navigate("CreateAccount")}
          buttonColor={theme.colors.primary}
          mode='elevated'
          style={{ width: "80%", height: 50 }}
          textColor={theme.colors.background}
          contentStyle={{ flexDirection: "row-reverse" }}
          icon={"cloud"}>
          <Text
            variant='titleLarge'
            style={{ fontWeight: "bold", color: theme.colors.background }}>
            Criar conta
          </Text>
        </Button>
        <Button
          onPress={() => navigation.navigate("Login")}
          buttonColor={theme.colors.tertiary}
          mode='elevated'
          style={{
            width: "80%",
            borderWidth: 2,
            height: 50,
          }}
          textColor={theme.colors.background}
          contentStyle={{ flexDirection: "row-reverse" }}
          icon={"cloud"}>
          <Text
            variant='titleLarge'
            style={{ fontWeight: "bold", color: theme.colors.background }}>
            Entrar
          </Text>
        </Button>
        <Button
          onPress={() => navigation.navigate("Login")}
          mode='outlined'
          style={{ width: "80%", borderWidth: 2, height: 50 }}
          textColor={theme.colors.onBackground}
          contentStyle={{ flexDirection: "row-reverse" }}
          icon={"folder"}>
          <Text variant='titleLarge' style={{ fontWeight: "bold" }}>
            Usar sem conta
          </Text>
        </Button>
      </AccountContainer>
    </ContainerAuth>
  );
};
export default Auth;
