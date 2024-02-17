import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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

import { useFocusEffect } from "@react-navigation/native";
import { showToast } from "../../services/toast";
import { BackHandler, StyleSheet } from "react-native";

import { AnimatedFAB, Appbar, Searchbar, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SafeContentEdge, ListsContainer } from "./styles";
import NewListItem from "../../components/NewListItem";

const Home = ({ navigation }) => {
  const theme = useTheme();

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
  useFocusEffect(
    useCallback(() => {
      const getList = async () => {
        const { data } = await GetLists();
        setLists(data);
        setReload(false);
      };
      getList();
    }, [reload])
  );

  useFocusEffect(
    useCallback(() => {
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

      if (onSearch) {
        refSearchbar?.current?.focus(), [onSearch];
      }

      return () => {
        backHandler.remove();
      };
    }, [mode, onSearch])
  );

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

    setMode(null);
  };

  return (
    <SafeContentEdge background={theme.colors.background}>
      <FocusAwareStatusBar
        color={theme.colors.elevation.level2}
        navColor={theme.colors.elevation.level2}
      />
      <Appbar
        safeAreaInsets={{ top }}
        style={{
          height: onSearch ? 110 : 90,
          backgroundColor: theme.colors.elevation.level2,
          paddingHorizontal: 20,
        }}>
        {onSearch ? (
          <Searchbar
            mode='view'
            showDivider={false}
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
            <Appbar.Content title='Listas' />
            <Appbar.Action
              icon='magnify'
              onPress={() => {
                setOnSearch(true);
              }}
            />
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
                navigation.navigate("List", {
                  list: {
                    ...list,
                    background: theme.colors.background,
                    accentColor: list.accent_color,
                    color: theme.colors[list.accent_color],
                    iconBackground: theme.colors.background,
                  },
                  action: "viewListItens",
                })
              }
              deleteHandle={deleteList}
              editHandle={(id, title, color, hideMenu) => {
                setMode("edit");
                setListEditId(id);
                setTitle(title);
                setColor(color);
                hideMenu();
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
                navigation.navigate("List", {
                  list: {
                    ...list,
                    background: theme.colors.background,
                    accentColor: list.accent_color,
                    color: theme.colors[list.accent_color],
                    iconBackground: theme.colors.background,
                  },
                  action: "viewListItens",
                })
              }
              deleteHandle={deleteList}
              editHandle={(id, title, color, hideMenu) => {
                setMode("edit");
                setListEditId(id);
                setTitle(title);
                setColor(color);
                hideMenu();
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
      {mode !== "add" && mode !== "edit" ? null : (
        <NewListItem
          type='Lists'
          mode={mode}
          theme={theme}
          blurBackground={theme.colors.backdrop}
          background={theme.colors.elevation.level5}
          labelColor={theme.colors.onBackground}
          labelBackground={theme.colors.elevation.level5}
          errorColor={theme.colors.error}
          colors={["primary", "secondary", "tertiary", "error"]}
          colorSelected={color}
          values={{ title }}
          onSelectedColor={theme.colors.onBackground}
          selectedColor={theme.colors.background}
          setProduct={setTitle}
          setColor={setColor}
          handlePress={mode === "add" ? addNewList : editList}
          onEdit={mode === "edit"}
          onDismiss={returnOfMode}
          visible={mode === "edit" || mode === "add"}
          error={errorInput}
        />
      )}
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
