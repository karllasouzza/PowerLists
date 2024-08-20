import {
  NewListItemContainer,
  NewListItemForm,
  NewListItemFormHeader,
  NewListItemFormRow,
} from "./styles";
import PrimaryInput from "../PrimaryInput";
import ColorCard from "./ColorCard";
import { Button, IconButton, Text } from "react-native-paper";
import { useState } from "react";

import BarcodeScan from "./BarcodeScan";

export default ({
  type,
  mode,
  theme,
  background,
  blurBackground,
  labelColor,
  labelBackground,
  setProduct,
  setPrice,
  setAmount,
  setColor,
  icons,
  setIcon,
  selectedIcon,
  colors,
  colorSelected,
  onEdit,
  values: { title, price, amount },
  errorColor,
  error,
  onSelectedColor,
  selectedColor,
  visible,
  handleSubmit,
  onDismiss,
}) => {
  const [isScan, setIsScan] = useState(false);

  const handleSetIsScan = () => {
    setIsScan((e) => !e);
  };

  if (type === "ListItems" && isScan) {
    return (
      <NewListItemContainer
        visible={isScan}
        onDismiss={handleSetIsScan}
        style={{ backgroundColor: blurBackground }}
      >
        <NewListItemFormHeader background={theme.colors.elevation.level5}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={handleSetIsScan}
            iconColor={theme.colors.onBackground}
          />
          <Text
            variant="titleLarge"
            style={{
              paddingTop: 5,
              marginLeft: 10,
              fontWeight: "bold",
              color: theme.colors.onBackground,
            }}
          >
            Escanear produto
          </Text>
        </NewListItemFormHeader>

        <BarcodeScan
          setProduct={setProduct}
          handleClose={handleSetIsScan}
          iconColor={theme.colors[colorSelected]}
          background={background}
        />
      </NewListItemContainer>
    );
  }

  return (
    <>
      <NewListItemContainer
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: blurBackground }}
      >
        <NewListItemFormHeader background={theme.colors.elevation.level5}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={onDismiss}
            iconColor={theme.colors.onBackground}
          />
          <Text
            variant="titleLarge"
            style={{
              paddingTop: 5,
              marginLeft: 10,
              fontWeight: "bold",
              color: theme.colors.onBackground,
            }}
          >
            {mode === "add" ? "Adicionar " : "Editar "}
            {type === "ListItems" ? "Produto" : "Lista"}
          </Text>
        </NewListItemFormHeader>

        <NewListItemForm background={background}>
          <NewListItemFormRow>
            <PrimaryInput
              width={type === "ListItems" ? "70" : "85"}
              labelValue={type === "ListItems" ? "Produto" : "Titulo"}
              labelColor={error === "title" ? errorColor : labelColor}
              labelBackground={labelBackground}
              type="text"
              autoComplete="off"
              secure={false}
              changeHandle={setProduct}
              edit={onEdit}
              value={title}
            />
            {type === "ListItems" && (
              <IconButton
                icon="barcode-scan"
                size={24}
                onPress={handleSetIsScan}
                iconColor={theme.colors.onBackground}
              />
            )}
          </NewListItemFormRow>
          <NewListItemFormRow>
            {type === "ListItems" ? (
              <PrimaryInput
                width={45}
                labelValue="Preço"
                labelColor={labelColor}
                labelBackground={labelBackground}
                type="numeric"
                autoComplete="off"
                secure={false}
                changeHandle={setPrice}
                edit={onEdit}
                value={price}
              />
            ) : null}
            {type === "ListItems" ? (
              <PrimaryInput
                width={45}
                labelValue="Quantia"
                labelColor={error === "amount" ? errorColor : labelColor}
                labelBackground={labelBackground}
                type="numeric"
                autoComplete="off"
                secure={false}
                changeHandle={setAmount}
                edit={onEdit}
                value={amount}
              />
            ) : null}
            {type === "Lists" ? (
              <NewListItemFormRow style={{ flexDirection: "column" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: theme.colors.onBackground,
                  }}
                >
                  Cor
                </Text>
                <NewListItemFormRow
                  style={{ justifyContent: "flex-start", gap: 10 }}
                >
                  {colors?.map((color, index) => (
                    <ColorCard
                      key={index}
                      theme={theme}
                      color={color}
                      width={50}
                      height={50}
                      tap={setColor}
                      selected={colorSelected}
                      onSelectedColor={onSelectedColor}
                      selectedColor={selectedColor}
                    />
                  ))}
                </NewListItemFormRow>
              </NewListItemFormRow>
            ) : null}
          </NewListItemFormRow>

          {type === "Lists" ? (
            <NewListItemFormRow style={{ flexDirection: "column" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: theme.colors.onBackground,
                }}
              >
                Ícone
              </Text>
              <NewListItemFormRow
                style={{
                  justifyContent: "flex-start",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {icons?.map((icon, i) => (
                  <IconButton
                    key={i}
                    icon={icon}
                    size={35}
                    onPress={() => setIcon(icon)}
                    iconColor={theme.colors[colorSelected]}
                    style={{
                      border: "1px solid",
                      padding: 3,
                      backgroundColor: theme.colors.elevation.level2,
                      borderWidth: icon === selectedIcon ? 2 : 0,
                      borderColor:
                        icon === selectedIcon
                          ? theme.colors[colorSelected]
                          : "white",
                      opacity: icon === selectedIcon ? 1 : 0.7,
                    }}
                  />
                ))}
              </NewListItemFormRow>
            </NewListItemFormRow>
          ) : null}

          <NewListItemFormRow>
            <Button
              mode="elevated"
              style={{ width: "100%" }}
              buttonColor={theme.colors[colorSelected]}
              onPress={handleSubmit}
              /*  loading={loading} */
            >
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: "bold",
                  color:
                    theme.colors[
                      `on${colorSelected[0]
                        .toUpperCase()
                        .concat(colorSelected.slice(1))}`
                    ],
                }}
              >
                {`${mode == "add" ? "Criar" : "Editar"} ${
                  type === "Lists" ? "Lista" : "Produto"
                }`}
              </Text>
            </Button>
          </NewListItemFormRow>
        </NewListItemForm>
      </NewListItemContainer>
    </>
  );
};
