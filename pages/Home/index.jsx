import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import { Ionicons } from "@expo/vector-icons";
import { Add, SafeContentEdge, UserSalutation, Header } from "./styles";
import { CardList } from "../../components/CardList";

const Home = () => {
  const insets = useSafeAreaInsets();

  const [lists, setLists] = useState([
    { title: "Compra Abril", current: 1, total: 5, totalPrice: 1000 },
  ]);

  return (
    <SafeContentEdge
      top={insets.top}
      bottom={insets.bottom}
      left={insets.left}
      right={insets.right}>
      <FocusAwareStatusBar />
      <Header>
        <UserSalutation>Listas</UserSalutation>
        <Add>
          <Ionicons name='add' size={24} />
        </Add>
      </Header>

      {lists?.map((list, index) => (
        <CardList key={index} list={list} />
      ))}
    </SafeContentEdge>
  );
};

export default Home;
