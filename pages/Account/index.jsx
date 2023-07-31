import { useContext, useState } from "react";
import AccountIcon from "../../assets/svgs/AccountIcon";

import theme from "../../assets/theme.json";
import {
  AccountCard,
  AccountCardContainer,
  AccountCardIconContainer,
  AccountCardSubTitle,
  AccountCardTitle,
  AccountHeader,
  AccountImageContainer,
  AccountName,
  AccountSafeContentEdge,
  BuymeABookCard,
  ProjectCard,
} from "./styles";
import Footer from "../../components/Footer";
import SingOutIcon from "../../assets/svgs/SingOutIcon";
import { Linking } from "react-native";
import GitHubIcon from "../../assets/svgs/GitHubIcon";
import BookIcon from "../../assets/svgs/BookIcon";
import AuthContext from "../../context/auth";

export default ({ navigation, route }) => {
  const [mode, setMode] = useState("account");
  const [colorMode, setListColorMode] = useState("light");
  const { singOut, user } = useContext(AuthContext);

  return (
    <AccountSafeContentEdge>
      <AccountHeader background={theme.schemes[colorMode].primaryContainer}>
        <AccountImageContainer background={theme.schemes[colorMode].primary}>
          <AccountIcon
            width={30}
            background={theme.schemes[colorMode].onPrimary}
          />
        </AccountImageContainer>
        <AccountName color={theme.schemes[colorMode].onPrimaryContainer}>
          {user.user_metadata.name}
        </AccountName>
      </AccountHeader>
      <AccountCardContainer>
        <AccountCard
          onPress={singOut}
          background={theme.schemes[colorMode].errorContainer}>
          <SingOutIcon
            width={30}
            background={theme.schemes[colorMode].onErrorContainer}
          />
          <AccountCardTitle color={theme.schemes[colorMode].onPrimaryContainer}>
            Sair
          </AccountCardTitle>
        </AccountCard>

        <ProjectCard background={theme.schemes[colorMode].secondaryContainer}>
          <AccountCardTitle
            color={theme.schemes[colorMode].onTertiaryContainer}>
            Sobre o projeto
          </AccountCardTitle>

          <AccountCardSubTitle
            color={theme.schemes[colorMode].onTertiaryContainer}>
            Este é um projeto open-source, você pode contribuir com o código,
            contribuir com suas ideias e sugestões!
          </AccountCardSubTitle>
          <AccountCardIconContainer
            onPress={() =>
              Linking.openURL("https://github.com/karllasouzza/PowerLists")
            }>
            <GitHubIcon
              background={theme.schemes[colorMode].onTertiaryContainer}
              width={40}
            />
          </AccountCardIconContainer>
        </ProjectCard>

        <AccountCard
          background={theme.schemes[colorMode].successContainer}
          onPress={() => Linking.openURL("https://bmc.link/karllasouzza")}>
          <BookIcon width={30} background={theme.schemes[colorMode].success} />
          <AccountCardTitle color={theme.schemes[colorMode].onSuccessContainer}>
            Buy me a Book
          </AccountCardTitle>
        </AccountCard>
      </AccountCardContainer>

      <Footer
        background={theme.schemes[colorMode].primaryFixed}
        iconColor={theme.schemes[colorMode].onPrimaryContainer}
        onIconColor={theme.schemes[colorMode].onPrimary}
        onIconBackground={theme.schemes[colorMode].onPrimaryFixedVariant}
        returnColor={theme.schemes[colorMode].error}
        returnBackground={theme.schemes[colorMode].errorContainer}
        mode={mode}
        route={route.name}
        // addHandle={() => setMode("add")}
        // addNewItem={addNewList}
        // returnOfAddMode={returnOfMode}
        // editItems={editList}
        // returnOfMode={returnOfMode}
        homeHandle={() => navigation.navigate("Home")}
        accountHandle={() => navigation.navigate("Account")}
      />
    </AccountSafeContentEdge>
  );
};
