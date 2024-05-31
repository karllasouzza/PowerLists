import {
  NewListItemContainer,
  NewListItemForm,
  NewListItemFormHeader,
  NewListItemFormRow,
} from "./styles";
import PrimaryInput from "../PrimaryInput";
import ColorCard from "./ColorCard";
import { Button, IconButton, Text } from "react-native-paper";

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
  return (
    <NewListItemContainer
      visible={visible}
      onDismiss={onDismiss}
      style={{ backgroundColor: blurBackground }}
    >
      <NewListItemFormHeader background={theme.colors[colorSelected]}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={onDismiss}
          iconColor={
            theme.colors[
              `on${colorSelected[0]
                .toUpperCase()
                .concat(colorSelected.slice(1))}`
            ]
          }
        />
        <Text
          variant="titleLarge"
          style={{
            paddingTop: 5,
            marginLeft: 10,
            fontWeight: "bold",
            color:
              theme.colors[
                `on${colorSelected[0]
                  .toUpperCase()
                  .concat(colorSelected.slice(1))}`
              ],
          }}
        >
          {mode === "add" ? "Adicionar " : "Editar "}
          {type === "ListItems" ? "Produto" : "Lista"}
        </Text>
      </NewListItemFormHeader>
      <NewListItemForm background={background}>
        <PrimaryInput
          width="85"
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
              Icone
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
                  iconColor={
                    theme.colors[
                      `on${colorSelected[0]
                        .toUpperCase()
                        .concat(colorSelected.slice(1))}`
                    ]
                  }
                  style={{
                    border: "1px solid",
                    padding: 3,
                    backgroundColor: icon === selectedIcon ? "white" : "black",
                    borderColor: icon === selectedIcon ? "white" : "black",
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
  );
};
