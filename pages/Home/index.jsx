import React, { useContext, useEffect, useState } from "react";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import { Ionicons } from "@expo/vector-icons";
import {
  Add,
  SafeContentEdge,
  Header,
  UserName,
  HeaderTitle,
  ListsContainer,
  Footer,
} from "./styles";
import { CardList } from "../../components/CardList";
import PrimaryButton from "../../components/PrimaryButton";
import AuthContext from "../../context/auth";
import * as NavigationBar from "expo-navigation-bar";

import theme from "../../assets/theme.json";
import { GetLists } from "../../services/supabase/lists";
import AddIcon from "../../assets/svgs/AddIcon";
import { showToast } from "../../services/toast";

const Home = ({ navigation, route }) => {
  NavigationBar.setBackgroundColorAsync(theme.palettes.primary[99]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getLists = async () => {
      try {
        const { data } = await GetLists();
        if (!data) throw new Error();
        setLists(data);
      } catch (erro) {
        console.log(erro);
        showToast({
          type: "error",
          title: "Erro!",
          subtitle:
            "Erro ao carregar lista, tente mais tarde ou refaça o login!",
        });
      }
    };

    getLists();
  }, []);

  const [lists, setLists] = useState([]);

  return (
    <SafeContentEdge background={theme.palettes.primary[95]}>
      <FocusAwareStatusBar color={theme.palettes.primary[95]} />
      <Header>
        <HeaderTitle>
          Olá, <UserName>{user.user_metadata.name.split(" ")[0]}</UserName>
        </HeaderTitle>

        {/* <UserImage /> */}
      </Header>
      <Header>
        <HeaderTitle>Listas</HeaderTitle>
      </Header>
      <ListsContainer>
        {lists?.map((list, index) => (
          <CardList
            key={index}
            list={{
              ...list,
              background: theme.coreColors.white,
              accentColor: theme.coreColors[list.accent_color],
              color: theme.coreColors.black,
              subColor: theme.palettes.neutral[40],
            }}
            pressHandler={() =>
              navigation.navigate("Add", {
                params: { lists_id: list.id },
              })
            }
          />
        ))}
      </ListsContainer>
      <Footer>
        <PrimaryButton
          color={theme.coreColors.white}
          background={theme.coreColors.secondary}>
          Selecionar todos
        </PrimaryButton>
        <Add background={theme.coreColors.white}>
          <AddIcon
            background={theme.coreColors.primary}
            color={theme.coreColors.black}
          />
        </Add>
      </Footer>
    </SafeContentEdge>
  );
};

export default Home;
