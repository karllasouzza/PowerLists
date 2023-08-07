import React, { useContext, useEffect, useState } from "react";
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

import { SafeContentEdge, Header, HeaderTitle, ListsContainer } from "./styles";
import { IconContainer } from "../ListItems/styles";
import { useIsFocused } from "@react-navigation/native";
import { showToast } from "../../services/toast";
import { BackHandler } from "react-native";
import ColorModeContext from "../../context/colorMode";

const Home = ({ navigation, route }) => {
  const focused = useIsFocused();
  const { theme, colorScheme } = useContext(ColorModeContext);

  NavigationBar.setBackgroundColorAsync(
    theme.schemes[colorScheme].primaryFixed
  );

  const [lists, setLists] = useState([]);
  const [mode, setMode] = useState("default");
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("primary");
  const [listEditId, setListEditId] = useState("");
  const [reload, setReload] = useState(false);
  const [errorInput, setErrorInput] = useState("");

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
    <SafeContentEdge background={theme.schemes[colorScheme].background}>
      <FocusAwareStatusBar
        color={theme.schemes[colorScheme].primaryContainer}
      />
      <Header background={theme.schemes[colorScheme].primaryContainer}>
        <HeaderTitle color={theme.schemes[colorScheme].onPrimaryContainer}>
          Listas
        </HeaderTitle>
        <IconContainer onPress={() => setReload(true)}>
          <ReloadIcon
            on={reload}
            background={theme.schemes[colorScheme].onPrimaryContainer}
          />
        </IconContainer>
      </Header>
      <ListsContainer>
        {lists?.map((list, index) => (
          <CardList
            key={index}
            list={{
              ...list,
              background: theme.schemes[colorScheme].background,
              accentColor: {
                name: list.accent_color,
                value: theme.schemes[colorScheme][list.accent_color],
              },
              color: theme.schemes[colorScheme][list.accent_color],
              subColor: theme.schemes[colorScheme].onSurfaceVariant,
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
          background={theme.schemes[colorScheme].shadow}
          closeHandle={returnOfMode}
        />
      )}
      {mode !== "add" && mode !== "edit" ? null : (
        <NewListItem
          type='Lists'
          background={theme.schemes[colorScheme].primaryFixed}
          labelColor={theme.schemes[colorScheme].shadow}
          labelBackground={theme.schemes[colorScheme].primaryFixed}
          errorColor={theme.schemes[colorScheme].error}
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
          onSelectedColor={theme.schemes[colorScheme].onBackground}
          selectedColor={theme.schemes[colorScheme].background}
        />
      )}
      <Footer
        background={theme.schemes[colorScheme].primaryFixed}
        iconColor={theme.schemes[colorScheme].onPrimaryFixed}
        onIconColor={theme.schemes[colorScheme].primaryFixedDim}
        onIconBackground={theme.schemes[colorScheme].onPrimaryFixedVariant}
        returnColor={theme.schemes[colorScheme].error}
        returnBackground={theme.schemes[colorScheme].errorContainer}
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
