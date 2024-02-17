import {
  NewListItemContainer,
  NewListItemForm,
  NewListItemFormRow,
} from "./styles";
import PrimaryInput from "../PrimaryInput";
import ColorCard from "./ColorCard";
import { Button, Text } from "react-native-paper";

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
  colors,
  colorSelected,
  setColor,
  onEdit,
  values: { title, price, amount },
  errorColor,
  error,
  onSelectedColor,
  selectedColor,
  visible,
  handlePress,
  onDismiss,
}) => {
  return (
    <NewListItemContainer
      visible={visible}
      onDismiss={onDismiss}
      style={{ backgroundColor: blurBackground }}>
      <NewListItemForm background={background}>
        <PrimaryInput
          width='85'
          labelValue={type === "ListItems" ? "Produto" : "Titulo"}
          labelColor={error === "title" ? errorColor : labelColor}
          labelBackground={labelBackground}
          type='text'
          autoComplete='off'
          secure={false}
          changeHandle={setProduct}
          edit={onEdit}
          value={title}
        />
        <NewListItemFormRow>
          {type === "ListItems" ? (
            <PrimaryInput
              width={12}
              labelValue='Preço'
              labelColor={labelColor}
              labelBackground={labelBackground}
              type='numeric'
              autoComplete='off'
              secure={false}
              changeHandle={setPrice}
              edit={onEdit}
              value={price}
            />
          ) : null}
          {type === "ListItems" ? (
            <PrimaryInput
              width={10}
              labelValue='Quantia'
              labelColor={error === "amount" ? errorColor : labelColor}
              labelBackground={labelBackground}
              type='numeric'
              autoComplete='off'
              secure={false}
              changeHandle={setAmount}
              edit={onEdit}
              value={amount}
            />
          ) : null}
          {type === "Lists"
            ? colors?.map((color, index) => (
                <ColorCard
                  key={index}
                  theme={theme}
                  color={color}
                  width={40}
                  height={40}
                  tap={setColor}
                  selected={colorSelected}
                  onSelectedColor={onSelectedColor}
                  selectedColor={selectedColor}
                />
              ))
            : null}
        </NewListItemFormRow>
        <NewListItemFormRow>
          <Button
            mode='elevated'
            style={{ width: "35%" }}
            buttonColor={theme.colors.errorContainer}
            onPress={onDismiss}>
            <Text
              variant='titleMedium'
              style={{
                fontWeight: "bold",
                color: theme.colors.error,
              }}>
              Cancelar
            </Text>
          </Button>
          <Button
            mode='elevated'
            style={{ width: "60%" }}
            buttonColor={theme.colors[colorSelected]}
            onPress={handlePress}
            /*  loading={loading} */
          >
            <Text
              variant='titleMedium'
              style={{
                fontWeight: "bold",
                color:
                  theme.colors[
                    `on${colorSelected[0]
                      .toUpperCase()
                      .concat(colorSelected.slice(1))}`
                  ],
              }}>
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
