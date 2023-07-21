import React, { useEffect, useState } from "react";

import theme from "../../assets/theme.json";
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
import NewListItem from "../../components/NewListItem";
import ListItem from "../../components/ListItem";
import ReturnIcon from "../../assets/svgs/ReturnIcon";
import Footer from "../../components/Footer";
import { GetListItems, NewItem } from "../../services/supabase/listItems";

export default ({ route, navigation: { goBack } }) => {
  const { list } = route.params;

  const [items, setItems] = useState([]);
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);

  const [mode, setMode] = useState("default");

  useEffect(() => {
    const getItens = async () => {
      try {
        const { data } = await GetListItems(list.id);
        if (!data) throw new Error();

        setItems(data);
      } catch (error) {
        console.log(error);
      }
    };
    getItens();
  }, [mode]);

  const addNewItem = async () => {
    try {
      const add = await NewItem(
        product,
        parseFloat(price.replace(",", ".")),
        parseInt(amount.replace(",", ".")),
        list.id
      );
      if (!add) throw new Error("Data not found");

      setProduct("");
      setPrice("");
      setAmount("");

      setMode("default");
    } catch (error) {}
  };

  const returnOfAddMode = () => {
    setProduct("");
    setPrice("");
    setAmount("");

    setMode("default");
  };

  return (
    <ListContainer background={theme.palettes.primary[100]}>
      <FocusAwareStatusBar color={theme.palettes[list.accent_color][90]} />
      <ListHeader background={theme.palettes[list.accent_color][90]}>
        <ItemsColumn>
          <ListHeaderTitle color={theme.coreColors.black}>
            {list.title}
          </ListHeaderTitle>
          <ListHeaderSubtitle color={theme.coreColors.black}>
            Total:{" "}
            {items?.map((item) => item.price).length
              ? items
                  ?.map((item) => item.price * item.amount)
                  ?.reduce((accum, curr) => accum + curr)
                  .toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })
              : items?.map((item) => item.price).length}
          </ListHeaderSubtitle>
        </ItemsColumn>
        <IconContainer background={theme.coreColors.white} onPress={goBack}>
          <ReturnIcon width={25} background={theme.coreColors.black} />
        </IconContainer>
      </ListHeader>
      <ListItemsContainer>
        {items.map((item) => (
          <ListItem
            key={item.id}
            item={item.title}
            price={item.price.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
            amount={item.amount}
            status={item.status}
            background={theme.coreColors.primary}
            checkColor={theme.coreColors.primary}
            color={theme.coreColors.black}
            subColor={theme.palettes.neutral[40]}
          />
        ))}
      </ListItemsContainer>

      {mode !== "add" ? (
        ""
      ) : (
        <NewListItem
          labelColor={theme.coreColors.white}
          labelBackground={theme.coreColors.primary}
          setProduct={setProduct}
          setPrice={setPrice}
          setAmount={setAmount}
        />
      )}
      <Footer
        mode={mode}
        setMode={setMode}
        addNewItem={addNewItem}
        returnOfAddMode={returnOfAddMode}
      />
    </ListContainer>
  );
};
