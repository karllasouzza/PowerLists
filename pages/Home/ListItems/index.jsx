import React, { useContext, useEffect, useState } from "react";
import * as NavigationBar from "expo-navigation-bar";

import {
  ListContainer,
  ListHeader,
  ListHeaderSubtitle,
  ListHeaderTitle,
  ListItemsContainer,
  ItemsColumn,
  IconContainer,
} from "./styles";
import { BackHandler } from "react-native";
import { useTheme } from "react-native-paper";
import { UseRealtimeItems } from "../../../services/supabase/realtime/Items";
import {
  CheckItem,
  DeleteItems,
  EditItem,
  GetItems,
  NewItem,
} from "../../../services/supabase/listItems";
import { showToast } from "../../../services/toast";
import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import ListItem from "../../../components/ListItem";
import NewListItem from "../../../components/NewListItem";

export default ({ action, navigation, route }) => {
  const theme = useTheme();
  const list = route.params?.list;

  const [items, setItems] = useState([]);
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState(0.0);
  const [amount, setAmount] = useState(0);
  const [mode, setMode] = useState("listItem");
  const [itemEditId, setItemEditId] = useState("");
  const [reload, setReload] = useState(false);
  const [errorInput, setErrorInput] = useState("");

  NavigationBar.setBackgroundColorAsync(
    theme.colors[list.accent_color + "Container"]
  );

  UseRealtimeItems(list.id, items, setItems);
  useEffect(() => {
    const getItens = async () => {
      try {
        const { data } = await GetItems(list.id);
        if (!data) throw new Error();

        setItems(data);
        setReload(false);
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
  }, [mode, reload]);

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
    setPrice(0.0);
    setAmount(0.0);
    setItemEditId("");
    setErrorInput("");

    setMode("listItem");
  };

  return (
    <ListContainer
      visible={true}
      background={theme.colors.background}
      contentContainerStyle={{ width: "100%" }}>
      <FocusAwareStatusBar
        color={theme.colors[list.accent_color + "Container"]}
      />
      <ListHeader background={theme.colors[list.accent_color + "Container"]}>
        <ItemsColumn>
          <ListHeaderTitle color={theme.colors.onBackground}>
            {list.title}
          </ListHeaderTitle>
          <ListHeaderSubtitle color={theme.colors.onBackground}>
            Total:{" "}
            {items?.map((item) => item.price).length
              ? items
                  ?.map((item) => item?.price * item?.amount)
                  ?.reduce((accum, curr) => accum + curr)
                  .toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })
              : items?.map((item) => item.price).length}
          </ListHeaderSubtitle>
        </ItemsColumn>
        <IconContainer onPress={() => setReload(true)}>
          {/* <ReloadIcon
            on={reload}
            background={theme.colors.onPrimaryContainer}
          /> */}
        </IconContainer>
      </ListHeader>
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

      {mode !== "add" && mode !== "edit" ? null : (
        <BlurPopUp
          zIndex={1}
          background={theme.colors.shadow}
          closeHandle={returnOfMode}
        />
      )}

      {mode !== "add" && mode !== "edit" ? null : (
        <NewListItem
          type='ListItems'
          background={theme.colors[list.accent_color + "Container"]}
          labelColor={theme.colors.onBackground}
          labelBackground={theme.colors[list.accent_color + "Container"]}
          errorColor={theme.colors.error}
          setProduct={setProduct}
          setPrice={setPrice}
          setAmount={setAmount}
          onEdit={mode === "edit"}
          values={{ title: product, price, amount }}
          error={errorInput}
        />
      )}
      {/* <Footer
        background={theme.colors[list.accent_color + "Fixed"]}
        iconColor={
          theme.colors[
            `on${
              list.accent_color.charAt(0).toUpperCase() +
              list.accent_color.slice(1)
            }Fixed`
          ]
        }
        onIconColor={theme.colors[list.accent_color + "FixedDim"]}
        onIconBackground={
          theme.colors[
            `on${
              list.accent_color.charAt(0).toUpperCase() +
              list.accent_color.slice(1)
            }FixedVariant`
          ]
        }
        returnBackground={theme.colors.errorContainer}
        returnColor={theme.colors.error}
        mode={mode}
        addNewItem={addNewItem}
        returnOfMode={returnOfMode}
        addHandle={() => setMode("add")}
        homeHandle={goBack}
        accountHandle={() => navigate("Account")}
        editItems={editItem}
      /> */}
    </ListContainer>
  );
};
