import React, { useContext, useEffect, useRef, useState } from "react";
import * as NavigationBar from "expo-navigation-bar";

import { UseRealtimeLists } from "../../services/supabase/realtime/lists";
import {
  GetLists,
  NewList,
  EditList,
  DeleteList,
} from "../../services/supabase/lists";

import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import ReloadContainer from "../../components/RotateAnimationContainer";
import { CardList } from "../../components/CardList";
import BlurPopUp from "../../components/BlurPopUp";
import NewListItem from "../../components/NewListItem";

import { SafeContentEdge, Header, HeaderTitle, ListsContainer } from "./styles";
import { useIsFocused } from "@react-navigation/native";
import { showToast } from "../../services/toast";
import { BackHandler, StyleSheet } from "react-native";

import {
  AnimatedFAB,
  Appbar,
  Portal,
  Searchbar,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Home = ({ navigation }) => {
  const focused = useIsFocused();
  const theme = useTheme();

  NavigationBar.setBackgroundColorAsync(theme.colors.elevation.level2);

  // Lists Add
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("primary");

  // ListEdit
  const [listEditId, setListEditId] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [mode, setMode] = useState(null);
  
  // AppBar
  const { top } = useSafeAreaInsets();
  const [reload, setReload] = useState(false);
  const [onSearch, setOnSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const refSearchbar = useRef(null);
  
  // AnimatedFAB
  const [isExtended, setIsExtended] = useState(true);

  

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

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
        } else if (onSearch) {
          setOnSearch(false);
          return true;
        }
      }
    );

    return () => {
      backHandler.remove();
    };
  }, [mode, onSearch]);

  useEffect(() => refSearchbar?.current?.focus(), [onSearch]);

  const filteredLists =
    searchQuery.length > 0
      ? lists.filter((list) =>
          list.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

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

    // setMode("default");
  };

  return (
    <SafeContentEdge background={theme.colors.background}>
      <FocusAwareStatusBar color={theme.colors.elevation.level2} />
      <Appbar
        safeAreaInsets={{ top }}
        style={{
          height: 90,
          backgroundColor: theme.colors.elevation.level2,
          paddingHorizontal: 10,
        }}>
        {onSearch ? (
          <Searchbar
            mode='view'
            showDivider={false}
            // elevation={1}
            style={{
              backgroundColor: theme.colors.elevation.level2,
              columnGap: 20,
              paddingHorizontal: 15,
            }}
            ref={refSearchbar}
            placeholder='Pesquisar listas'
            onChangeText={(query) => setSearchQuery(query)}
            onIconPress={() => setOnSearch(false)}
            icon='arrow-left'
            value={searchQuery}
          />
        ) : (
          <>
            <Appbar.Content title='Listas' style={{ marginLeft: 10 }} />
            <Appbar.Action
              icon='magnify'
              onPress={() => {
                setOnSearch(true);
              }}
            />
            <ReloadContainer on={reload}>
              <Appbar.Action icon='reload' onPress={() => setReload(true)} />
            </ReloadContainer>
          </>
        )}
      </Appbar>

      {searchQuery.length > 0 && onSearch ? (
        <ListsContainer onScroll={onScroll}>
          {filteredLists?.map((list, index) => (
            <CardList
              key={index}
              list={{
                ...list,
                background: theme.colors.background,
                accentColor: {
                  name: list.accent_color,
                  value: theme.colors[list.accent_color],
                },
                color: theme.colors[list.accent_color],
                iconBackground: theme.colors.background,
              }}
              pressHandler={() =>
                navigation.navigate("Add", {
                  list: list,
                })
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
      ) : (
        <ListsContainer onScroll={onScroll}>
          {lists?.map((list, index) => (
            <CardList
              key={index}
              list={{
                ...list,
                background: theme.colors.background,
                accentColor: {
                  name: list.accent_color,
                  value: theme.colors[list.accent_color],
                },
                color: theme.colors[list.accent_color],
                iconBackground: theme.colors.background,
              }}
              pressHandler={() =>
                navigation.navigate("Add", {
                  list: list,
                })
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
      )}

      <AnimatedFAB
        icon={"plus"}
        label={"Nova lista"}
        extended={isExtended}
        onPress={() => setMode("add")}
        iconMode={"dynamic"}
        style={[styles.fabStyle]}
      />

      {/* {mode !== "add" && mode !== "edit" ? null : (
        <BlurPopUp
          zIndex={1}
          background={theme.colors.shadow}
          closeHandle={returnOfMode}
        />
      )} */}
      {/* {mode !== "add" && mode !== "edit" ? null : (
        <Portal>
          <NewListItem
            type='Lists'
            background={theme.colors.onPrimary}
            labelColor={theme.colors.onBackground}
            labelBackground={theme.colors.onPrimary}
            errorColor={theme.colors.error}
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
            visible={mode === "edit" || mode === "add"}
            values={{ title }}
            error={errorInput}
            onSelectedColor={theme.colors.onBackground}
            selectedColor={theme.colors.background}
          />
        </Portal>
      )} */}
      {/* <Footer
        background={theme.colors.onPrimary}
        iconColor={theme.colors.ononPrimary}
        onIconColor={theme.colors.onPrimaryDim}
        onIconBackground={theme.colors.ononPrimaryVariant}
        returnColor={theme.colors.error}
        returnBackground={theme.colors.errorContainer}
        mode={mode}
        route={route.name}
        addHandle={() => setMode("add")}
        addNewItem={addNewList}
        returnOfAddMode={returnOfMode}
        editItems={editList}
        returnOfMode={returnOfMode}
        homeHandle={() => navigation.navigate("Home")}
        accountHandle={() => navigation.navigate("Account")}
      /> */}
    </SafeContentEdge>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  fabStyle: {
    bottom: 16,
    right: 10,
    position: "absolute",
    flexGrow: 1,
  },
});
