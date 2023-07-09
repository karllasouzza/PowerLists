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

const Home = () => {
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
      }
    };

    getLists();
  }, []);

  const [lists, setLists] = useState([]);

  return (
    <SafeContentEdge background={theme.palettes.primary[99]}>
      <FocusAwareStatusBar color={theme.palettes.primary[99]} />
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
          <CardList key={index} list={list} />
        ))}
      </ListsContainer>
      <Footer>
        <PrimaryButton
          color={theme.coreColors.white}
          background={theme.coreColors.black}>
          Selecionar todos
        </PrimaryButton>
        <Add>
          <Ionicons name='add' size={24} />
        </Add>
      </Footer>
    </SafeContentEdge>
  );
};

export default Home;
