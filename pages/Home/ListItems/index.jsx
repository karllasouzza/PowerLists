import React, { useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { UseRealtimeItems } from "../../../services/supabase/realtime/Items";

import { showToast } from "../../../services/toast";
import {
  CheckItem,
  DeleteItems,
  EditItem,
  GetItems,
  NewItem,
} from "../../../services/supabase/listItems";

import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import ListItem from "../../../components/ListItem";
import NewListItem from "../../../components/NewListItem";

import { ListContainer, ListItemsContainer } from "./styles";

export default ({ navigation, route }) => {
  const theme = useTheme();
  const list = route.params?.list;
  const { top, bottom } = useSafeAreaInsets();

  const [items, setItems] = useState([]);
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("0");
  const [amount, setAmount] = useState("1");
  const [mode, setMode] = useState("listItem");
  const [itemEditId, setItemEditId] = useState("");
  const [errorInput, setErrorInput] = useState("");

  useFocusEffect(
    useCallback(() => {
      const getItens = async () => {
        try {
          const { data } = await GetItems(list.id);
          if (!data) throw new Error();

          setItems(data);
        } catch (error) {}
      };
      getItens();

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
    }, [mode])
  );

  useFocusEffect(
    useCallback(() => {
      UseRealtimeItems(list.id, items, setItems);
    }, [items])
  );

  const addNewItem = async () => {
    try {
      if (product.length < 3) {
        setErrorInput("title");
        showToast({
          type: "error",
          title: "Titulo do produto invalido!",
          subtitle: "O titulo tem que ter 3 ou mais caracteres!",
        });
        throw new Error();
      }
      if (parseInt(amount.replace(",", ".")) < 1) {
        setErrorInput("amount");

        showToast({
          type: "error",
          title: "Quantidade do produto invalida!",
          subtitle: "A quantidade tem que ser maior que 0!",
        });

        throw new Error();
      }
      const add = await NewItem(
        product,
        parseFloat(price.replace(",", ".")),
        parseInt(amount.replace(",", ".")),
        list.id
      );
      if (!add) throw new Error();

      returnOfMode();
    } catch (error) {}
  };

  const checkItem = async (id, status) => {
    try {
      const erro = CheckItem(id, !status);
      if (!erro) throw new Error();
    } catch (error) {}
  };

  const editItem = async () => {
    try {
      if (product.length < 3) {
        setErrorInput("title");
        showToast({
          type: "error",
          title: "Titulo do produto invalido!",
          subtitle: "O titulo tem que ter 3 ou mais caracteres!",
        });
        throw new Error();
      }
      if (parseInt(amount.replace(",", ".")) < 1) {
        setErrorInput("amount");

        showToast({
          type: "error",
          title: "Quantidade do produto invalida!",
          subtitle: "A quantidade tem que ser maior que 0!",
        });

        throw new Error();
      }
      const erro = await EditItem(
        itemEditId,
        product,
        parseFloat(price.replace(",", ".")),
        parseInt(amount.replace(",", "."))
      );
      if (!erro) throw new Error();

      returnOfMode();
    } catch (error) {}
  };

  const deleteItem = async (id) => {
    try {
      const erro = DeleteItems(id);
      if (!erro) throw new Error();
    } catch (error) {}
  };

  const returnOfMode = () => {
    setProduct("");
    setPrice("0");
    setAmount("1");
    setItemEditId("");
    setErrorInput("");

    setMode("listItem");
  };

  const sumTotal = () => {
    const totalItems = items?.map((item) => item.price);

    if (totalItems.length) {
      const total = items
        ?.map((item) => item?.price * item?.amount)
        ?.reduce((accum, curr) => accum + curr);

      return total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      });
    } else return totalItems.length;
  };

  return (
    <>
      <ListContainer
        visible
        background={theme.colors.background}
        contentContainerStyle={{ width: "100%" }}
      >
        <FocusAwareStatusBar
          color={theme.colors.elevation.level2}
          navColor={theme.colors.elevation.level2}
        />
        <Appbar
          safeAreaInsets={{ top }}
          style={{
            height: 90,
            backgroundColor: theme.colors.elevation.level2,
            paddingHorizontal: 20,
          }}
        >
          <Appbar.Action
            color={theme.colors.onBackground}
            icon="arrow-left"
            onPress={() => navigation.goBack()}
          />
          <Appbar.Content
            color={theme.colors.onBackground}
            title={list.title}
            style={{ marginLeft: 10 }}
          />
        </Appbar>

        <ListItemsContainer>
          {items
            .sort(function compare(a, b) {
              let dateA = new Date(a.created_at);
              let dateB = new Date(b.created_at);
              return dateA - dateB;
            })
            .map((item) =>
              !item.status ? (
                <ListItem
                  key={item.id}
                  background={theme.colors[list.accent_color]}
                  status={item.status}
                  title={item.title}
                  item={item}
                  price={item?.price?.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  amount={item.amount}
                  color={theme.colors.onBackground}
                  subColor={theme.colors.inverseSurface}
                  checkColor={theme.colors[list.accent_color]}
                  checkHandle={() => checkItem(item.id, item.status)}
                  editHandle={({ id, title, price, amount }) => {
                    setMode("edit");
                    setItemEditId(id);
                    setProduct(title);
                    setPrice(String(price));
                    setAmount(String(amount));
                  }}
                  deleteHandle={deleteItem}
                />
              ) : null
            )}
          {items
            .sort(function compare(a, b) {
              let dateA = new Date(a.created_at);
              let dateB = new Date(b.created_at);
              return dateA - dateB;
            })
            .map((item) =>
              item.status ? (
                <ListItem
                  key={item.id}
                  background={theme.colors[list.accent_color]}
                  options={{
                    background: theme.colors[list.accent_color],
                    deleteBackground: theme.colors.errorContainer,
                    deleteColor: theme.colors.error,
                    editBackground: theme.colors.tertiaryContainer,
                    editColor: theme.colors.tertiary,
                    shadow: theme.colors.shadow,
                  }}
                  status={item.status}
                  title={item.title}
                  item={item}
                  price={item?.price?.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  amount={item.amount}
                  color={theme.colors.onBackground}
                  subColor={theme.colors.inverseSurface}
                  checkColor={theme.colors[list.accent_color]}
                  checkHandle={() => checkItem(item.id, item.status)}
                  editHandle={({ id, title, price, amount }) => {
                    setMode("edit");
                    setItemEditId(id);
                    setProduct(title);
                    setPrice(String(price));
                    setAmount(String(amount));
                  }}
                  deleteHandle={deleteItem}
                />
              ) : null
            )}
        </ListItemsContainer>

        <Appbar
          safeAreaInsets={{ bottom }}
          style={{
            width: "100%",
            height: 50,
            backgroundColor: theme.colors.elevation.level2,
            paddingLeft: 20,
            paddingRight: 15,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <Appbar.Action
            icon="plus"
            size={35}
            color={theme.colors[list.accent_color]}
            style={{ borderRadius: 5 }}
            onPress={() => setMode("add")}
          />

          <Appbar.Content
            color={theme.colors.onBackground}
            title={`Total: ${sumTotal()}`}
            titleStyle={{ width: "auto" }}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          />
        </Appbar>
      </ListContainer>

      <NewListItem
        type="ListItems"
        mode={mode}
        theme={theme}
        colorSelected={list.accent_color}
        blurBackground={theme.colors.backdrop}
        background={theme.colors.background}
        labelBackground={theme.colors.elevation.level5}
        labelColor={theme.colors.onBackground}
        setProduct={setProduct}
        setPrice={setPrice}
        setAmount={setAmount}
        onEdit={mode === "edit"}
        values={{ title: product, price, amount }}
        errorColor={theme.colors.error}
        error={errorInput}
        visible={mode === "edit" || mode === "add"}
        handleSubmit={mode === "add" ? addNewItem : editItem}
        onDismiss={returnOfMode}
      />
    </>
  );
};
