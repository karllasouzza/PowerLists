import React, { useContext, useEffect, useState } from "react";
import * as NavigationBar from "expo-navigation-bar";

import {
  CheckItem,
  DeleteItems,
  EditItem,
  GetItems,
  NewItem,
} from "../../services/supabase/listItems";

import NewListItem from "../../components/NewListItem";
import ListItem from "../../components/ListItem";
import Footer from "../../components/Footer";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";

import {
  ListContainer,
  ListHeader,
  ListHeaderSubtitle,
  ListHeaderTitle,
  ListItemsContainer,
  ItemsColumn,
  IconContainer,
} from "./styles";
import ReloadIcon from "../../assets/svgs/ReloadIcon";
import BlurPopUp from "../../components/BlurPopUp";
import { showToast } from "../../services/toast";
import { UseRealtimeItems } from "../../services/supabase/realtime/Items";
import { BackHandler } from "react-native";
import ColorModeContext from "../../context/colorMode";

export default ({ route, navigation: { goBack, navigate } }) => {
  const { theme, colorScheme } = useContext(ColorModeContext);

  const { list } = route.params;
  const [items, setItems] = useState([]);
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState(0.0);
  const [amount, setAmount] = useState(0);
  const [mode, setMode] = useState("listItem");
  const [itemEditId, setItemEditId] = useState("");
  const [reload, setReload] = useState(false);
  const [errorInput, setErrorInput] = useState("");

  NavigationBar.setBackgroundColorAsync(
    theme.schemes[colorScheme][list.accent_color + "Fixed"]
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
    <ListContainer background={theme.schemes[colorScheme].background}>
      <FocusAwareStatusBar
        color={theme.schemes[colorScheme][list.accent_color + "Container"]}
      />
      <ListHeader
        background={
          theme.schemes[colorScheme][list.accent_color + "Container"]
        }>
        <ItemsColumn>
          <ListHeaderTitle color={theme.schemes[colorScheme].onBackground}>
            {list.title}
          </ListHeaderTitle>
          <ListHeaderSubtitle color={theme.schemes[colorScheme].onBackground}>
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
          <ReloadIcon
            on={reload}
            background={theme.schemes[colorScheme].onPrimaryContainer}
          />
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
                background={theme.schemes[colorScheme][list.accent_color]}
                options={{
                  background: theme.schemes[colorScheme][list.accent_color],
                  deleteBackground: theme.schemes[colorScheme].errorContainer,
                  deleteColor: theme.schemes[colorScheme].error,
                  editBackground: theme.schemes[colorScheme].tertiaryContainer,
                  editColor: theme.schemes[colorScheme].tertiary,
                  shadow: theme.schemes[colorScheme].shadow,
                }}
                status={item.status}
                title={item.title}
                item={item}
                price={item?.price?.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
                amount={item.amount}
                color={theme.schemes[colorScheme].onBackground}
                subColor={theme.schemes[colorScheme].inverseSurface}
                checkColor={theme.schemes[colorScheme][list.accent_color]}
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
                background={theme.schemes[colorScheme][list.accent_color]}
                options={{
                  background: theme.schemes[colorScheme][list.accent_color],
                  deleteBackground: theme.schemes[colorScheme].errorContainer,
                  deleteColor: theme.schemes[colorScheme].error,
                  editBackground: theme.schemes[colorScheme].tertiaryContainer,
                  editColor: theme.schemes[colorScheme].tertiary,
                  shadow: theme.schemes[colorScheme].shadow,
                }}
                status={item.status}
                title={item.title}
                item={item}
                price={item?.price?.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
                amount={item.amount}
                color={theme.schemes[colorScheme].onBackground}
                subColor={theme.schemes[colorScheme].inverseSurface}
                checkColor={theme.schemes[colorScheme][list.accent_color]}
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
          background={theme.schemes[colorScheme].shadow}
          closeHandle={returnOfMode}
        />
      )}

      {mode !== "add" && mode !== "edit" ? null : (
        <NewListItem
          type='ListItems'
          background={
            theme.schemes[colorScheme][list.accent_color + "Container"]
          }
          labelColor={theme.schemes[colorScheme].onBackground}
          labelBackground={
            theme.schemes[colorScheme][list.accent_color + "Container"]
          }
          errorColor={theme.schemes[colorScheme].error}
          setProduct={setProduct}
          setPrice={setPrice}
          setAmount={setAmount}
          onEdit={mode === "edit"}
          values={{ title: product, price, amount }}
          error={errorInput}
        />
      )}
      <Footer
        background={theme.schemes[colorScheme][list.accent_color + "Fixed"]}
        iconColor={
          theme.schemes[colorScheme][
            `on${
              list.accent_color.charAt(0).toUpperCase() +
              list.accent_color.slice(1)
            }Fixed`
          ]
        }
        onIconColor={theme.schemes[colorScheme][list.accent_color + "FixedDim"]}
        onIconBackground={
          theme.schemes[colorScheme][
            `on${
              list.accent_color.charAt(0).toUpperCase() +
              list.accent_color.slice(1)
            }FixedVariant`
          ]
        }
        returnBackground={theme.schemes[colorScheme].errorContainer}
        returnColor={theme.schemes[colorScheme].error}
        mode={mode}
        addNewItem={addNewItem}
        returnOfMode={returnOfMode}
        addHandle={() => setMode("add")}
        homeHandle={goBack}
        accountHandle={() => navigate("Account")}
        editItems={editItem}
      />
    </ListContainer>
  );
};
