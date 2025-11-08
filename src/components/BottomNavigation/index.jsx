import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import Home from "../../features/home";
import Account from "../../features/account";
import ListItems from "../../features/ListItems";

export default () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "lists",
      title: "Listas",
      focusedIcon: "file-document",
      unfocusedIcon: "file-document-outline",
    },
    {
      key: "groups",
      title: "Grupos",
      focusedIcon: "folder",
      unfocusedIcon: "folder-outline",
    },
    {
      key: "account",
      title: "Perfil",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    lists: Home,
    groups: Home,
    account: Account,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};
