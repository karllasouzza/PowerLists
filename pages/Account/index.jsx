import { useContext, useState } from "react";
import AccountIcon from "../../assets/svgs/AccountIcon";

import {
  AccountCard,
  AccountCardContainer,
  AccountCardTitle,
  AccountHeader,
  AccountImageContainer,
  AccountName,
  AccountSafeContentEdge,
} from "./styles";
import Footer from "../../components/Footer";
import SingOutIcon from "../../assets/svgs/SingOutIcon";
import AuthContext from "../../context/auth";
// import ColorModeContext from "../../context/colorMode";

export default ({ navigation, route }) => {
  const { theme, colorScheme } = useContext(ColorModeContext);

  const [mode, setMode] = useState("account");
  const { singOut, user } = useContext(AuthContext);

  return (
    <AccountSafeContentEdge background={theme.schemes[colorScheme].background}>
      <AccountHeader background={theme.schemes[colorScheme].primaryContainer}>
        <AccountImageContainer background={theme.schemes[colorScheme].primary}>
          <AccountIcon
            width={30}
            background={theme.schemes[colorScheme].onPrimary}
          />
        </AccountImageContainer>
        <AccountName color={theme.schemes[colorScheme].onPrimaryContainer}>
          {user.user_metadata.name}
        </AccountName>
      </AccountHeader>
      <AccountCardContainer>
        <AccountCard
          onPress={singOut}
          background={theme.schemes[colorScheme].errorContainer}>
          <SingOutIcon
            width={30}
            background={theme.schemes[colorScheme].onErrorContainer}
          />
          <AccountCardTitle
            color={theme.schemes[colorScheme].onPrimaryContainer}>
            Sair
          </AccountCardTitle>
        </AccountCard>
      </AccountCardContainer>

      <Footer
        background={theme.schemes[colorScheme].primaryFixed}
        iconColor={theme.schemes[colorScheme].onPrimaryFixed}
        onIconColor={theme.schemes[colorScheme].primaryFixedDim}
        onIconBackground={theme.schemes[colorScheme].onPrimaryFixedVariant}
        returnColor={theme.schemes[colorScheme].error}
        returnBackground={theme.schemes[colorScheme].errorContainer}
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
