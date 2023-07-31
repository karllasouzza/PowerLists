import React, { useEffect, useState } from "react";
import * as NavigationBar from "expo-navigation-bar";

import { UseRealtimeLists } from "../../services/supabase/realtime/lists";
import {
  GetLists,
  NewList,
  EditList,
  DeleteList,
} from "../../services/supabase/lists";

import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import ReloadIcon from "../../assets/svgs/ReloadIcon";
import { CardList } from "../../components/CardList";
import BlurPopUp from "../../components/BlurPopUp";
import NewListItem from "../../components/NewListItem";
import Footer from "../../components/Footer";

import theme from "../../assets/theme.json";
import { SafeContentEdge, Header, HeaderTitle, ListsContainer } from "./styles";
import { IconContainer } from "../ListItems/styles";
import { useIsFocused } from "@react-navigation/native";
import { showToast } from "../../services/toast";
import { BackHandler } from "react-native";

const Home = ({ navigation, route }) => {
  const focused = useIsFocused();
  const [lists, setLists] = useState([]);
  const [mode, setMode] = useState("default");
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("primary");
  const [listEditId, setListEditId] = useState("");
  const [reload, setReload] = useState(false);
  const [errorInput, setErrorInput] = useState("");
  const [colorMode, setListColorMode] = useState("light");

  NavigationBar.setBackgroundColorAsync(theme.schemes[colorMode].primaryFixed);

  UseRealtimeLists(lists, setLists);
  useEffect(() => {
    const getLists = async () => {
      try {
        const { data } = await GetLists();
        if (!data) throw new Error();
        setLists(data);
        setReload(false);
      } catch (erro) {}
    };

    getLists();
  }, [reload]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (mode === "add" || mode === "edit") {
          returnOfMode();
          return true;
        }
      }
    );

    return () => {
      backHandler.remove();
    };
  }, [mode]);

  const addNewList = async () => {
    try {
      if (title.length < 3) {
        setErrorInput("title");
        showToast({
          type: "error",
          title: "Titulo da lista invalido!",
          subtitle: "O titulo tem que ter 3 ou mais caracteres!",
        });
        throw new Error();
      }

      const data = await NewList(title, color);
      if (!data) throw new Error();

      returnOfMode();
    } catch (error) {}
  };

  const editList = async () => {
    try {
      if (title.length < 3) {
        setErrorInput("title");
        showToast({
          type: "error",
          title: "Titulo da lista invalido!",
          subtitle: "O titulo tem que ter 3 ou mais caracteres!",
        });
        throw new Error();
      }

      const erro = await EditList(listEditId, title, color);
      if (!erro) throw new Error();

      returnOfMode();
    } catch (erro) {}
  };

  const deleteList = async (id, setLongPress) => {
    try {
      const erro = await DeleteList(id);
      console.log(erro);
      if (!erro) throw new Error("Error");

      setLongPress(false);
    } catch (error) {}
  };

  const returnOfMode = () => {
    setTitle("");
    setColor("primary");
    setListEditId("");
    setErrorInput("");

    setMode("default");
  };

  return (
    <SafeContentEdge background={theme.schemes[colorMode].background}>
      <FocusAwareStatusBar color={theme.schemes[colorMode].primaryContainer} />
      <Header background={theme.schemes[colorMode].primaryContainer}>
        <HeaderTitle color={theme.schemes[colorMode].onPrimaryContainer}>
          Listas
        </HeaderTitle>
        <IconContainer onPress={() => setReload(true)}>
          <ReloadIcon
            on={reload}
            background={theme.schemes[colorMode].onPrimaryContainer}
          />
        </IconContainer>
      </Header>
      <ListsContainer>
        {lists?.map((list, index) => (
          <CardList
            key={index}
            list={{
              ...list,
              background: theme.schemes[colorMode].background,
              accentColor: {
                name: list.accent_color,
                value: theme.schemes[colorMode][list.accent_color],
              },
              color: theme.coreColors.black,
              subColor: theme.palettes.neutral[40],
            }}
            pressHandler={
              mode === "default"
                ? () =>
                    navigation.navigate("Add", {
                      list: list,
                    })
                : null
            }
            deleteHandle={deleteList}
            editHandle={(id, title, color) => {
              setMode("edit");
              setListEditId(id);
              setTitle(title);
              setColor(color);
            }}
          />
        ))}
      </ListsContainer>
      {mode !== "add" && mode !== "edit" ? null : (
        <BlurPopUp
          zIndex={1}
          background={theme.schemes[colorMode].shadow}
          closeHandle={returnOfMode}
        />
      )}
      {mode !== "add" && mode !== "edit" ? null : (
        <NewListItem
          type='Lists'
          background={theme.schemes[colorMode].primaryFixed}
          labelColor={theme.schemes[colorMode].onBackground}
          labelBackground={theme.schemes[colorMode].primaryContainer}
          errorColor={theme.schemes[colorMode].error}
          setProduct={setTitle}
          colors={[
            "primary",
            "secondary",
            "tertiary",
            "error",
            "success",
            "fourtiary",
          ]}
          setColor={setColor}
          colorSelected={color}
          onEdit={mode === "edit"}
          values={{ title }}
          error={errorInput}
        />
      )}
      <Footer
        background={theme.schemes[colorMode].primaryFixed}
        iconColor={theme.schemes[colorMode].onPrimaryContainer}
        onIconColor={theme.schemes[colorMode].onPrimary}
        onIconBackground={theme.schemes[colorMode].onPrimaryFixedVariant}
        returnColor={theme.schemes[colorMode].error}
        returnBackground={theme.schemes[colorMode].errorContainer}
        mode={mode}
        route={route.name}
        addHandle={() => setMode("add")}
        addNewItem={addNewList}
        returnOfAddMode={returnOfMode}
        editItems={editList}
        returnOfMode={returnOfMode}
        homeHandle={() => navigation.navigate("Home")}
        accountHandle={() => navigation.navigate("Account")}
      />
    </SafeContentEdge>
  );
};

export default Home;
